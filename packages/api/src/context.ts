import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import * as jose from "jose";
import { z } from "zod";

import { prisma } from "@gym/db";

import { envs } from "./api-envs.js";

const payloadSchema = z.object({
	userId: z.string(),
	email: z.string().email(),
	isAdmin: z.boolean(),
});

export async function createContext(opts: CreateFastifyContextOptions) {
	return {
		auth: await auth(opts),
		prisma,
	};
}

async function auth({ req }: CreateFastifyContextOptions) {
	const accessToken = req.headers.authorization?.replace("Bearer ", "");
	const { payload } = await jose
		.jwtVerify(accessToken ?? "", envs.JWT_SECRET, {
			issuer: envs.JWT_ISSUER,
			audience: envs.JWT_AUDIENCE,
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

	return auth;
}

export type Context = inferAsyncReturnType<typeof createContext>;
