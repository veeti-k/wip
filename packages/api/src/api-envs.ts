import { z } from "zod";

const envSchema = z.object({
	JWT_SECRET: z.string().transform((s) => new TextEncoder().encode(s)),
	JWT_ISSUER: z.string(),
	JWT_AUDIENCE: z.string(),

	FRONT_BASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
