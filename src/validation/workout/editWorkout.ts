import { z } from "zod";

export const editWorkoutFormSchema = z.object({
	notes: z.string().nullable(),
	bodyWeight: z.number({ invalid_type_error: "Numbers only!" }).nullable(),
});

export const editWorkoutInputSchema = editWorkoutFormSchema.and(
	z.object({ workoutId: z.string() })
);

export type EditWorkoutFormType = z.infer<typeof editWorkoutFormSchema>;
