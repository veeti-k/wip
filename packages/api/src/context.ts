import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import * as jose from "jose";
import { z } from "zod";

import { prisma } from "@gym/db";

import { env } from "./api-envs.js";

const payloadSchema = z.object({
	userId: z.string(),
	email: z.string().email(),
	isAdmin: z.boolean(),
});

export const createContext = async (opts: CreateFastifyContextOptions) => {
	return {
		auth: await auth(opts),
		prisma,
	};
};

const auth = async ({ req }: CreateFastifyContextOptions) => {
	const accessToken = req.headers["authorization"]?.replace("Bearer ", "");
	const { payload } = await jose
		.jwtVerify(accessToken || "", env.JWT_SECRET, {
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
				.then((res) => (res?.success ? res.data : null))
				.catch(() => null)
		: null;

	return auth;
};

export type Context = inferAsyncReturnType<typeof createContext>;
