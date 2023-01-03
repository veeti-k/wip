import { z } from "zod";

export const form = z.object({
	name: z.string().min(1, { message: "Required" }),
});

export const input = form;

export type FormType = z.infer<typeof form>;
