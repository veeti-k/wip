import { getUserId } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { dbSession } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import { AddExercise } from './add-exercise';
import { SessionActions } from './session-menu';

export default async function Page({
	params: { sessionId },
}: {
	params: { sessionId: string };
}) {
	const userId = await getUserId();
	const session = await unstable_cache(async () => {
		const session = await db.query.dbSession.findFirst({
			where: and(
				eq(dbSession.id, sessionId),
				eq(dbSession.userId, userId),
			),
		});

		if (!session) {
			redirect('/app/sessions');
		}

		return session;
	}, ['session', sessionId, userId])();

	return (
		<div className="flex flex-col h-full">
			<div className="px-4 py-4 border-b flex justify-between items-center">
				<h1 className="text-lg font-medium">{session.name}</h1>
			</div>

			<div className="h-full overflow-auto"></div>

			<div className="border-t gap-3 py-3 px-3 flex items-center">
				<AddExercise session={session} />

				<SessionActions session={session} />
			</div>
		</div>
	);
}
