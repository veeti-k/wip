import { z } from "zod";

export const updateExerciseFormSchema = z.object({
	notes: z.string().nullable(),
});

export const updateExerciseInputSchema = updateExerciseFormSchema.and(
	z.object({
		sessionId: z.string(),
		exerciseId: z.string(),
	})
);

export type UpdateExerciseFormType = z.infer<typeof updateExerciseFormSchema>;
