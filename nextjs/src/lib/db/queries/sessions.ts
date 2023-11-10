import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { dbSession } from '../schema';

export async function getSessionWithExercises(
	sessionId: string,
	userId: string,
) {
	return await db.query.dbSession.findFirst({
		where: and(eq(dbSession.id, sessionId), eq(dbSession.userId, userId)),
		with: { exercises: true },
	});
}
