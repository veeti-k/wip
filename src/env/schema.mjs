// @ts-check
import { z } from "zod";

export const serverSchema = z.object({
	DATABASE_URL: z.string().url(),
	NODE_ENV: z.enum(["development", "test", "production"]),

	G_CLIENT_ID: z.string(),
	G_CLIENT_SECRET: z.string(),

	NEXTAUTH_SECRET: z.string(),
});

/** @type {{ [k in keyof z.infer<typeof serverSchema>]: z.infer<typeof serverSchema>[k] | undefined }} */
export const serverEnv = {
	DATABASE_URL: process.env.DATABASE_URL,
	NODE_ENV: process.env.NODE_ENV,

	G_CLIENT_ID: process.env.G_CLIENT_ID,
	G_CLIENT_SECRET: process.env.G_CLIENT_SECRET,

	NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
};

export const clientSchema = z.object({});

/** @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }} */
export const clientEnv = {};
