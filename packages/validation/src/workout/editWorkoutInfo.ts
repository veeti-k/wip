import { z } from "zod";

export const form = z.object({
	name: z.string(),
	createdAt: z.string(),
	stoppedAt: z.string().nullable(),
});

export const input = z.object({
	workoutId: z.string(),
	name: z.string(),
	createdAt: z.date(),
	stoppedAt: z.date().nullable(),
});

export type FormType = z.infer<typeof form>;
