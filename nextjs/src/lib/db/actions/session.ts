'use server';

import { getUserId } from '@/lib/auth';
import { createId } from '@/lib/id';
import { validateFormData } from '@/lib/utils';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { object, string } from 'valibot';
import { db } from '../db';
import { dbSession } from '../schema';

export async function createSession(formData: FormData) {
	const data = validateFormData(formData, object({ name: string() }));

	const userId = await getUserId();

	const id = createId();

	await db.insert(dbSession).values({
		userId,
		id,
		name: data.name,
		startedAt: new Date(),
		createdAt: new Date(),
	});

	revalidateTag('sessions');
	redirect(`/app/sessions/${id}`);
}
