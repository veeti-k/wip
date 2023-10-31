import { z } from "zod";

export const updateWorkoutExerciseSetFormSchema = z.object({
	reps: z.number().nullable(),
	count: z.number(),
});

export const updateWorkoutExerciseSetInputSchema = updateWorkoutExerciseSetFormSchema.and(
	z.object({
		workoutId: z.string(),
		exerciseId: z.string(),
		setId: z.string(),
	})
);

export type UpdateWorkoutExerciseSetFormType = z.infer<typeof updateWorkoutExerciseSetFormSchema>;
