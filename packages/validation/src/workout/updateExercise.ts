import { z } from "zod";

export const form = z.object({
	notes: z.string().nullable(),
});

export const input = form.and(
	z.object({
		workoutId: z.string(),
		exerciseId: z.string(),
	})
);

export type FormType = z.infer<typeof form>;
