import { z } from "zod";

const envSchema = z.object({
	G_CLIENT_ID: z.string(),
	G_CLIENT_SECRET: z.string(),
	G_REDIRECT_URI: z.string(),

	JWT_SECRET: z.string().transform((s) => new TextEncoder().encode(s)),
	JWT_ISSUER: z.string(),
	JWT_AUDIENCE: z.string(),

	FRONT_BASE_URL: z.string(),
});

export const envs = envSchema.parse(process.env);
