import { z } from "zod";

export const editSessionInfoFormSchema = z.object({
	name: z.string(),
	createdAt: z.string(),
	stoppedAt: z.string().nullable(),
});

export const editSessionInfoInputSchema = z.object({
	sessionId: z.string(),
	name: z.string(),
	createdAt: z.date(),
	stoppedAt: z.date().nullable(),
});

export type EditSessionInfoFormType = z.infer<typeof editSessionInfoFormSchema>;
