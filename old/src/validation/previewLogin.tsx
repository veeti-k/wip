import { z } from "zod";

export const previewLoginFormSchema = z.object({
	username: z.string(),
	password: z.string(),
});

export type PreviewLoginFormType = z.infer<typeof previewLoginFormSchema>;
