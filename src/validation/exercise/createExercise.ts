import { z } from "zod";

import { modelExerciseFields } from "~server/_defaultUserStuff";

const fieldArray = Object.keys(modelExerciseFields);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const acceptedFields = z.enum([fieldArray.at(0)!, ...fieldArray.slice(1)]);

export const createExerciseFormSchema = z.object({
	name: z.string().min(1, { message: "Required" }),
	categoryId: z.string().min(1, { message: "Required" }),
	enabledFields: z
		.array(acceptedFields)
		.min(1, { message: "Required" })
		.max(fieldArray.length, { message: "Too many fields" }),
});

export const createExerciseInputSchema = z.object({
	name: z.string().min(1, { message: "Required" }),
	categoryId: z.string().min(1, { message: "Required" }),
	enabledFields: z
		.array(acceptedFields)
		.min(1, { message: "Required" })
		.max(fieldArray.length, { message: "Too many fields" })
		.transform((arr) =>
			arr.reduce(
				(acc, curr) => acc | modelExerciseFields[curr as keyof typeof modelExerciseFields],
				BigInt(0)
			)
		),
});

export type CreateExerciseFormType = z.infer<typeof createExerciseFormSchema>;