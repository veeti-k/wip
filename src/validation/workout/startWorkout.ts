import { z } from "zod";

export const startWorkoutFormSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Required" })
		.min(3, { message: "Too short!" })
		.max(25, { message: "Too long!" }),
});

export const startWorkoutInputSchema = startWorkoutFormSchema;

export type StartWorkoutFormType = z.infer<typeof startWorkoutFormSchema>;
