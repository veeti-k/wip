import { z } from "zod";

export const startSessionFormSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Required" })
		.min(3, { message: "Too short!" })
		.max(25, { message: "Too long!" }),
});

export const startSessionInputSchema = startSessionFormSchema;

export type StartSessionFormType = z.infer<typeof startSessionFormSchema>;
