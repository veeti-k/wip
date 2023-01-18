import { z } from "zod";

export const editWorkoutInfoFormSchema = z.object({
	name: z.string(),
});

export const editWorkoutInfoInputSchema = editWorkoutInfoFormSchema.and(
	z.object({ workoutId: z.string() })
);

export type EditWorkoutInfoFormType = z.infer<typeof editWorkoutInfoFormSchema>;
