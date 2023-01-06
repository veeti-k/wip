import { z } from "zod";

const coolerNumber = z.custom((v) => (isNaN(v as number) ? null : v)).nullable();

export const form = z.object({
	reps: coolerNumber,
	weight: coolerNumber,
	time: coolerNumber,
	distance: coolerNumber,
	kcal: coolerNumber,
	duplicates: z.number(),
});

export const input = z.object({
	setId: z.string(),
	reps: z.number().nullable(),
	weight: z.number().nullable(),
	time: z.number().nullable(),
	distance: z.number().nullable(),
	kcal: z.number().nullable(),
	duplicates: z.number(),
});

export type FormType = z.infer<typeof form>;
