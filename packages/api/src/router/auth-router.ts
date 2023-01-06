import { TRPCError } from "@trpc/server";
import { addDays, addMinutes } from "date-fns";
import * as jose from "jose";
import nodemailer from "nodemailer";
import { z } from "zod";

import { env } from "../api-envs.js";
import { protectedProcedure, publicProcedure, router } from "../trpc.js";

const emailTokenPayloadSchema = z.object({
	email: z.string(),
	verificationId: z.string(),
	emailToken: z.boolean().refine((v) => v === true),
	waiterToken: z.boolean().refine((v) => v === false),
});

const waiterTokenPayloadSchema = z.object({
	email: z.string(),
	verificationId: z.string(),
	emailToken: z.boolean().refine((v) => v === false),
	waiterToken: z.boolean().refine((v) => v === true),
});

export const authRouter = router({
	info: protectedProcedure.query(async ({ ctx }) => {
		return {
			userId: ctx.auth?.userId,
			email: ctx.auth?.email,
			isAdmin: ctx.auth?.isAdmin,
		};
	}),
	initiateMagicLink: publicProcedure
		.input(
			z.object({
				email: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { email } = input;

			const verification = await ctx.prisma.verification.create({
				data: { expiresAt: addMinutes(new Date(), 5) },
			});

			const emailToken = await new jose.SignJWT({
				email,
				verificationId: verification.id,
				emailToken: true,
				waiterToken: false,
			})
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime("5m")
				.setIssuer(env.JWT_ISSUER)
				.setAudience(env.JWT_AUDIENCE)
				.sign(env.JWT_SECRET);

			const waiterToken = await new jose.SignJWT({
				email,
				verificationId: verification.id,
				emailToken: false,
				waiterToken: true,
			})
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime("5m")
				.setIssuer(env.JWT_ISSUER)
				.setAudience(env.JWT_AUDIENCE)
				.sign(env.JWT_SECRET);

			const transporter = nodemailer.createTransport({
				host: env.SMTP_HOST,
				port: env.SMTP_PORT,
				secure: false,
				auth: {
					user: env.SMTP_USER,
					pass: env.SMTP_PASS,
				},
			});

			const message = {
				from: env.SMTP_FROM,
				to: email,
				subject: "Your magic link",
				html: `<a href="${encodeURI(
					`${env.FRONT_BASE_URL}/auth/magic?token=${emailToken}&email=${email}`
				)}">Click here to login</a>`,
			};

			await transporter.sendMail(message);

			return { waiterToken };
		}),

	verifyWaiterToken: publicProcedure
		.input(
			z.object({
				email: z.string(),
				token: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { token, email } = input;

			const { payload } = await jose
				.jwtVerify(token, env.JWT_SECRET, {
					issuer: env.JWT_ISSUER,
					audience: env.JWT_AUDIENCE,
				})
				.catch(() => {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Invalid token",
					});
				});

			const tokenPayload = await waiterTokenPayloadSchema.safeParseAsync(payload);

			if (!tokenPayload.success) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Invalid token",
				});
			}

			const verification = await ctx.prisma.verification.findUnique({
				where: { id: tokenPayload.data.verificationId },
			});

			if (!verification) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Invalid token",
				});
			}

			if (!verification.verifiedAt) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "Not verified",
				});
			}

			const user = await ctx.prisma.user.findUnique({
				where: { email },
			});

			if (!user) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Invalid email",
				});
			}

			const expiresAt = addDays(new Date(), 30);

			const accessToken = await new jose.SignJWT({
				userId: user.id,
				email: user.email,
				isAdmin: user.isAdmin,
			})
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
				.setIssuer(env.JWT_ISSUER)
				.setAudience(env.JWT_AUDIENCE)
				.sign(env.JWT_SECRET);

			return { accessToken, expiresAt };
		}),

	confirmLogin: publicProcedure
		.input(
			z.object({
				email: z.string(),
				emailToken: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { emailToken, email } = input;

			const { payload } = await jose.jwtVerify(emailToken, env.JWT_SECRET, {
				issuer: env.JWT_ISSUER,
				audience: env.JWT_AUDIENCE,
			});

			const tokenPayload = await emailTokenPayloadSchema.safeParseAsync(payload);

			if (!tokenPayload.success) {
				console.log(tokenPayload.error.errors);

				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Invalid token",
				});
			}

			const verification = await ctx.prisma.verification.findUnique({
				where: { id: tokenPayload.data.verificationId },
			});

			if (!verification) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Invalid token",
				});
			}

			await ctx.prisma.verification.update({
				where: { id: verification.id },
				data: { verifiedAt: new Date() },
			});

			const user = await ctx.prisma.user.upsert({
				where: { email },
				create: { email },
				update: {},
			});

			const expiresAt = addDays(new Date(), 30);

			const accessToken = await new jose.SignJWT({
				userId: user.id,
				email: user.email,
				isAdmin: user.isAdmin,
			})
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
				.setIssuer(env.JWT_ISSUER)
				.setAudience(env.JWT_AUDIENCE)
				.sign(env.JWT_SECRET);

			return { accessToken, expiresAt };
		}),
});
