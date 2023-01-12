// @ts-check
import { z } from "zod";

export const serverSchema = z.object({
	DATABASE_URL: z.string().url(),
	ENV: z.enum(["development", "test", "production"]),

	G_CLIENT_ID: z.string(),
	G_CLIENT_SECRET: z.string(),

	NEXTAUTH_SECRET: z.string(),

	PREVIEW_PASSWORD: z.string(),
});

/** @type {{ [k in keyof z.infer<typeof serverSchema>]: string | undefined }} */
export const serverEnv = {
	DATABASE_URL: process.env.DATABASE_URL,
	ENV: process.env.ENV,

	G_CLIENT_ID: process.env.G_CLIENT_ID,
	G_CLIENT_SECRET: process.env.G_CLIENT_SECRET,

	NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

	PREVIEW_PASSWORD: process.env.PREVIEW_PASSWORD,
};

export const clientSchema = z.object({
	NEXT_PUBLIC_ENV: z.enum(["development", "test", "production"]),
});

/** @type {{ [k in keyof z.infer<typeof clientSchema>]: string | undefined }} */
export const clientEnv = {
	NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
};
