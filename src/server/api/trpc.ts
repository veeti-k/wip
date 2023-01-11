import { TRPCError, initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import * as jose from "jose";
import superjson from "superjson";
import { z } from "zod";

import { env } from "~env/server.mjs";

import { prisma } from "../db";

const payloadSchema = z.object({
	userId: z.string(),
	email: z.string().email(),
	isAdmin: z.boolean(),
});

type CreateContextOptions = {
	auth: {
		userId: string;
		email: string;
		isAdmin: boolean;
	} | null;
};

const createInnerTRPCContext = ({ auth }: CreateContextOptions) => {
	return {
		auth,
		prisma,
	};
};

export const createTRPCContext = async ({ req }: CreateNextContextOptions) => {
	const accessToken = req.headers.authorization?.replace("Bearer ", "");
	const { payload } = await jose
		.jwtVerify(accessToken ?? "", env.JWT_SECRET, {
			issuer: env.JWT_ISSUER,
			audience: env.JWT_AUDIENCE,
		})
		.catch((err) => {
			console.error("Failed to verify JWT - Cause: ", err);

			return { payload: null };
		});

	const auth = payload
		? await payloadSchema
				.safeParseAsync(payload)
				.then((res) => (res.success ? res.data : null))
				.catch(() => null)
		: null;

	return createInnerTRPCContext({ auth });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape;
	},
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
	if (!ctx.auth) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Not authenticated",
		});
	}

	ctx.prisma.user
		.update({
			where: { id: ctx.auth.userId },
			data: { lastOnlineAt: new Date() },
		})
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		.catch((err) => console.error(`Db call failed at isAuthed middleware: ${err}`));

	return next({
		ctx: { auth: ctx.auth },
	});
});

const isAdmin = t.middleware(async ({ ctx, next }) => {
	if (!ctx.auth?.isAdmin) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Forbidden",
		});
	}

	return next();
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(isAuthed);
export const adminProcedure = protectedProcedure.use(isAdmin);
