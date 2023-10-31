import { z } from "zod";

export const editSessionInfoFormSchema = z.object({
	name: z.string(),
	startedAt: z.string(),
	stoppedAt: z.string().nullable(),
});

export const editSessionInfoInputSchema = z.object({
	sessionId: z.string(),
	name: z.string(),
	startedAt: z.date(),
	stoppedAt: z.date().nullable(),
});

export type EditSessionInfoFormType = z.infer<typeof editSessionInfoFormSchema>;
