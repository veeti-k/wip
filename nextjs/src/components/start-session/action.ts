'use server';

import { getUserId } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { dbSession } from '@/lib/db/schema';
import { createId } from '@/lib/id';
import { validateFormData } from '@/lib/validate-form-data';
import { revalidateTag } from 'next/cache';
import { object, string, type Output } from 'valibot';

const startSessionDataSchema = object({
	name: string(),
});

export async function startSessionWithValidation(formData: FormData) {
	const res = await validateFormData(formData, startSessionDataSchema);

	if (!res.success) {
		return res;
	}

	return startSession(res.data);
}

export async function startSession(
	data: Output<typeof startSessionDataSchema>,
) {
	const userId = await getUserId();

	await db.insert(dbSession).values({
		userId,
		id: createId(),
		name: data.name,
		startedAt: new Date(),
		createdAt: new Date(),
	});

	revalidateTag('sessions');
	revalidateTag('onGoingSessions');
}
