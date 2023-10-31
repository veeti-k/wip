import { z } from "zod";

export const createCategoryFormSchema = z.object({
	name: z.string().min(1, { message: "Required" }),
});

export const createCategoryInputSchema = createCategoryFormSchema;

export type CreateCategoryFormType = z.infer<typeof createCategoryFormSchema>;
