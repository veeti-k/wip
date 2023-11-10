import { createId } from '@/lib/id';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { dbAuthSession } from '../schema';

export async function getAuthSession(sessionId: string) {
	const session = await db.query.dbAuthSession.findFirst({
		where: eq(dbAuthSession.id, sessionId),
	});

	return session;
}

export async function createAuthSession(userId: string) {
	const sessionId = createId();

	await db.insert(dbAuthSession).values({
		id: sessionId,
		userId,
		createdAt: new Date(),
	});

	return sessionId;
}

export async function deleteAuthSession(sessionId: string, userId: string) {
	await db
		.delete(dbAuthSession)
		.where(
			and(
				eq(dbAuthSession.id, sessionId),
				eq(dbAuthSession.userId, userId),
			),
		);
}
