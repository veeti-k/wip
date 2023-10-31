// @ts-check
import { z } from "zod";

export const serverSchema = z.object({
	MONGODB_URI: z.string().url(),
	ENV: z.enum(["development", "test", "production"]),

	G_CLIENT_ID: z.string(),
	G_CLIENT_SECRET: z.string(),

	NEXTAUTH_SECRET: z.string(),
	NEXTAUTH_URL: z.string().url().optional(),

	PREVIEW_PASSWORD: z.string(),
});

/** @type {{ [k in keyof z.infer<typeof serverSchema>]: string | undefined }} */
export const serverEnv = {
	MONGODB_URI: process.env.MONGODB_URI,
	ENV: process.env.ENV,

	G_CLIENT_ID: process.env.G_CLIENT_ID,
	G_CLIENT_SECRET: process.env.G_CLIENT_SECRET,

	NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
	NEXTAUTH_URL: process.env.NEXTAUTH_URL,

	PREVIEW_PASSWORD: process.env.PREVIEW_PASSWORD,
};

export const clientSchema = z.object({
	NEXT_PUBLIC_ENV: z.enum(["development", "test", "production"]),
});

/** @type {{ [k in keyof z.infer<typeof clientSchema>]: string | undefined }} */
export const clientEnv = {
	NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
};
