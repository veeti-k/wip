import { z } from "zod";

export const editSessionFormSchema = z.object({
	notes: z.string().nullable(),
	bodyWeight: z.number({ invalid_type_error: "Numbers only!" }).nullable(),
});

export const editSessionInputSchema = editSessionFormSchema.and(
	z.object({ sessionId: z.string() })
);

export type EditSessionFormType = z.infer<typeof editSessionFormSchema>;
