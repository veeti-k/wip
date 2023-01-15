import { z } from "zod";

import { DbModelExerciseEnabledField, dbModelExerciseEnabledFields } from "~server/db/types";

export const createExerciseFormSchema = z.object({
	name: z.string().min(1, { message: "Required" }),
	categoryName: z.string().min(1, { message: "Required" }),
	enabledFields: z
		.array(z.string())
		.min(1, { message: "Required" })
		.max(dbModelExerciseEnabledFields.length, { message: "Too many fields" })
		// @ts-expect-error - i just want to check if includes
		.refine((fields) => fields.forEach((f) => dbModelExerciseEnabledFields.includes(f)), {
			message: "Invalid enabled fields",
		})
		.transform((f) => f as DbModelExerciseEnabledField[]),
});

export const createExerciseInputSchema = z.object({
	name: z.string().min(1, { message: "Required" }),
	categoryName: z.string().min(1, { message: "Required" }),
	enabledFields: z
		.array(z.string())
		.min(1, { message: "Required" })
		.max(dbModelExerciseEnabledFields.length, { message: "Too many fields" })
		// @ts-expect-error - i just want to check if includes
		.refine((fields) => fields.forEach((f) => dbModelExerciseEnabledFields.includes(f)), {
			message: "Invalid enabled fields",
		})
		.transform((f) => f as DbModelExerciseEnabledField[]),
});

export type CreateExerciseFormType = z.infer<typeof createExerciseFormSchema>;
