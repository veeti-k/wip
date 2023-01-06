import { z } from "zod";

export const form = z.object({
	reps: z.number().nullable(),
	weight: z.number().nullable(),
	time: z.number().nullable(),
	distance: z.number().nullable(),
	kcal: z.number().nullable(),
	duplicates: z.number(),
});

export const input = form.and(
	z.object({
		setId: z.string(),
	})
);

export type FormType = z.infer<typeof form>;
