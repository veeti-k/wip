import { StartSession } from '@/components/start-session/start-session';
import { TimeSince } from '@/components/timer';
import { getUserId } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { dbSession } from '@/lib/db/schema';
import { and, eq, isNull, lte } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { Suspense } from 'react';

export default async function Page() {
	return (
		<div className="flex flex-col h-full">
			<div className="px-4 py-4 border-b flex justify-between items-center">
				<h1 className="text-lg font-medium">home</h1>
			</div>

			<div className="h-full overflow-auto">
				<Suspense
					fallback={
						<p className="py-2 px-4 border-b">
							getting on going sessions...
						</p>
					}
				>
					<OnGoingSessions />
				</Suspense>
			</div>

			<div className="border-t gap-3 py-3 px-3 flex items-center">
				<StartSession />
			</div>
		</div>
	);
}

async function OnGoingSessions() {
	const userId = await getUserId();
	const onGoingSessions = await unstable_cache(
		() =>
			db.query.dbSession.findMany({
				where: and(
					eq(dbSession.userId, userId),
					lte(dbSession.startedAt, new Date()),
					isNull(dbSession.stoppedAt),
				),
			}),
		['onGoingSessions', userId],
		{ tags: ['sessions'] },
	)();

	return !onGoingSessions.length ? (
		<p className="px-4 py-2 border-b w-full">no on going sessions</p>
	) : (
		<ul className="divide-y border-b">
			{onGoingSessions.map((session) => (
				<li key={session.id}>
					<a
						href={`/app/sessions/${session.id}`}
						className="py-2 px-4 w-full flex justify-between gap-4"
					>
						<h2 className="truncate">{session.name}</h2>
						<TimeSince date={new Date(session.startedAt)} />
					</a>
				</li>
			))}
		</ul>
	);
}
