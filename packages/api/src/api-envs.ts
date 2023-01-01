import { z } from "zod";

const envSchema = z.object({
	SMTP_HOST: z.string(),
	SMTP_PORT: z.string().transform(Number),
	SMTP_USER: z.string(),
	SMTP_PASS: z.string(),
	SMTP_FROM: z.string(),

	JWT_SECRET: z.string().transform((s) => new TextEncoder().encode(s)),
	JWT_ISSUER: z.string(),
	JWT_AUDIENCE: z.string(),

	NOTIFICATION_SERVICE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
