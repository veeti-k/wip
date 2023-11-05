import { TimeSince } from '@/components/timer';
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
	const session = await unstable_cache(
		async () => {
			const session = await db.query.dbSession.findFirst({
				where: and(
					eq(dbSession.id, sessionId),
					eq(dbSession.userId, userId),
				),
				with: { exercises: true },
			});

			if (!session) {
				redirect('/app/sessions');
			}

			return session;
		},
		['session', sessionId, userId],
		{ tags: ['sessions'] },
	)();

	return (
		<div className="flex flex-col h-full">
			<div className="px-4 py-4 border-b flex justify-between items-center hyphens-auto break-words truncate">
				<h2 className="text-lg font-medium w-full max-w-full">
					{session.name}
				</h2>

				<TimeSince date={new Date(session.startedAt)} />
			</div>

			<div className="h-full overflow-auto">
				{!session.exercises.length ? (
					<p className="p-5 border-b w-full text-center">
						no exercises
					</p>
				) : (
					<ul className="divide-y border-b">
						{session.exercises.map((exercise) => (
							<li key={exercise.id}>
								<div className="px-4 py-2 border-b">
									<h2 className="text-lg font-medium truncate">
										{exercise.name}
									</h2>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>

			<div className="border-t gap-3 py-3 px-3 flex items-center">
				<AddExercise />

				<SessionActions />
			</div>
		</div>
	);
}
