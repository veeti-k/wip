import { z } from "zod";

export const form = z.object({
	name: z
		.string()
		.min(1, { message: "Required" })
		.min(3, { message: "Too short!" })
		.max(25, { message: "Too long!" }),
});

export const input = form;

export type FormType = z.infer<typeof form>;
