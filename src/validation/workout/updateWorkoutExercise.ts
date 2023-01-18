import { z } from "zod";

export const updateWorkoutExerciseFormSchema = z.object({
	notes: z.string().nullable(),
});

export const updateWorkoutExerciseInputSchema = updateWorkoutExerciseFormSchema.and(
	z.object({
		workoutId: z.string(),
		exerciseId: z.string(),
	})
);

export type UpdateWorkoutExerciseFormType = z.infer<typeof updateWorkoutExerciseFormSchema>;
