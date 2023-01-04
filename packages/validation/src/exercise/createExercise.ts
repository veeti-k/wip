import { z } from "zod";

import { modelExerciseFields } from "@gym/db/modelExerciseFields";

const fieldArray = Object.keys(modelExerciseFields);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const acceptedFields = z.enum([fieldArray.at(0)!, ...fieldArray.slice(1)]);

export const form = z.object({
	name: z.string().min(1, { message: "Required" }),
	categoryId: z.string().min(1, { message: "Required" }),
	enabledFields: z
		.array(acceptedFields)
		.min(1, { message: "Required" })
		.max(fieldArray.length, { message: "Too many fields" }),
});

export const input = z.object({
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

export type FormType = z.infer<typeof form>;
