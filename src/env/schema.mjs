// @ts-check
import { z } from "zod";

export const serverSchema = z.object({
	APP_BASE_URL: z.string().url(),

	DATABASE_URL: z.string().url(),
	NODE_ENV: z.enum(["development", "test", "production"]),

	G_CLIENT_ID: z.string(),
	G_CLIENT_SECRET: z.string(),
	G_REDIRECT_URI: z.string(),

	JWT_SECRET: z.string().transform((s) => new TextEncoder().encode(s)),
	JWT_ISSUER: z.string(),
	JWT_AUDIENCE: z.string(),
});

/** @type {{ [k in keyof z.infer<typeof serverSchema>]: z.infer<typeof serverSchema>[k] | undefined }} */
export const serverEnv = {
	APP_BASE_URL: process.env.APP_BASE_URL,

	DATABASE_URL: process.env.DATABASE_URL,
	NODE_ENV: process.env.NODE_ENV,

	G_CLIENT_ID: process.env.G_CLIENT_ID,
	G_CLIENT_SECRET: process.env.G_CLIENT_SECRET,
	G_REDIRECT_URI: process.env.G_REDIRECT_URI,

	// @ts-expect-error annoying ts
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_ISSUER: process.env.JWT_ISSUER,
	JWT_AUDIENCE: process.env.JWT_AUDIENCE,
};

export const clientSchema = z.object({});

/** @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }} */
export const clientEnv = {};
