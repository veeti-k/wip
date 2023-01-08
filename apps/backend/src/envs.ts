import { z } from "zod";

const envSchema = z.object({
	FRONT_BASE_URL: z.string(),
});

export const envs = envSchema.parse(process.env);
