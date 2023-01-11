import { z } from "zod";

export const updateExerciseSetFormSchema = z.object({
	reps: z.number().nullable(),
	weight: z.number().nullable(),
	assistedWeight: z.number().nullable(),
	time: z.number().nullable(),
	distance: z.number().nullable(),
	kcal: z.number().nullable(),
	duplicates: z.number(),
});

export const updateExerciseSetInputSchema = updateExerciseSetFormSchema.and(
	z.object({
		setId: z.string(),
	})
);

export type UpdateExerciseSetFormType = z.infer<typeof updateExerciseSetFormSchema>;
