'use server';

import { getUserId } from '@/lib/auth';
import { createId } from '@/lib/id';
import { validateFormData } from '@/lib/validate-form-data';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { object, string } from 'valibot';
import { db } from '../db';
import { dbSession } from '../schema';

export async function createSession(formData: FormData) {
	const data = await validateFormData(formData, object({ name: string() }));

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
	return { sessionId: id };
}

const handleErr = <
	T extends (...args: any[]) => Promise<any>,
	TReturn = Awaited<ReturnType<T>>,
>(
	fn: T,
) => {
	return async (...args: Parameters<T>) => {
		try {
			const returnValue = await fn(...args);

			const t = {
				success: true,
				...returnValue,
			} as { success: true | null } & TReturn;

			return t;
		} catch (error) {
			console.error(error);
			return {
				success: false as boolean | null,
				error: (error.message ?? String(error)) as string | null,
			};
		}
	};
};

export const deleteSession = handleErr(async (sessionId: string) => {
	const userId = await getUserId();

	await new Promise((resolve) => setTimeout(resolve, 600));

	const { rowsAffected } = await db
		.delete(dbSession)
		.where(and(eq(dbSession.id, sessionId), eq(dbSession.userId, userId)));

	if (rowsAffected === 0) {
		throw new Error('session not found');
	}

	revalidateTag('sessions');

	return { data: 'test' };
});
