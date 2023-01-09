import { z } from "zod";

export const form = z.object({
	notes: z.string().nullable(),
	bodyWeight: z.number({ invalid_type_error: "Numbers only!" }).nullable(),
});

export const input = form.and(
	z.object({
		workoutId: z.string(),
	})
);

export type FormType = z.infer<typeof form>;
