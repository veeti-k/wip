import { TimeSince } from '@/components/timer';
import { Button } from '@/components/ui/button';
import { getUserId } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { dbSession } from '@/lib/db/schema';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { unstable_cache } from 'next/cache';
import { Suspense } from 'react';

const months = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december',
];

export default async function Page() {
	const now = new Date();
	const month = months[now.getMonth()];
	const year = now.getFullYear();

	return (
		<div className="flex flex-col h-full">
			<div className="px-4 py-4 border-b flex justify-between items-center">
				<h1 className="text-lg font-medium">sessions</h1>
			</div>

			<div className="h-full overflow-auto">
				<Suspense
					fallback={
						<p className="py-2 px-4 border-b">
							getting sessions...
						</p>
					}
				>
					<SessionList />
				</Suspense>
			</div>

			<div className="border-t gap-3 py-3 px-3 flex items-center">
				<Button size="icon" variant={'secondary'} className="px-2">
					<ChevronLeft />
				</Button>

				<div className="flex w-full gap-1.5">
					<Button
						variant={'secondary'}
						className="w-full rounded-r-[0.2rem]"
					>
						{month}
					</Button>

					<Button
						variant={'secondary'}
						className="rounded-l-[0.2rem]"
					>
						{year}
					</Button>
				</div>

				<Button size="icon" variant={'secondary'} className="px-2">
					<ChevronRight />
				</Button>
			</div>
		</div>
	);
}

async function SessionList() {
	const userId = await getUserId();
	const sessions = await unstable_cache(
		() =>
			db.query.dbSession.findMany({
				where: eq(dbSession.userId, userId),
				with: { exercises: true },
				orderBy: (t, { desc }) => desc(t.createdAt),
			}),
		['sessions', userId],
		{ tags: ['sessions'] },
	)();

	return !sessions.length ? (
		<p className="px-4 py-2 border-b w-full">no sessions</p>
	) : (
		<ul className="divide-y border-b">
			{sessions.map((session) => {
				const startedAt = new Date(session.startedAt);

				return (
					<li key={session.id} className="w-full">
						<a
							href={`/app/sessions/${session.id}`}
							className="py-2 px-4 flex gap-4 w-full"
						>
							<time
								className="flex flex-col items-center"
								dateTime={format(
									startedAt,
									"yyyy-MM-dd'T'HH:mm",
								)}
							>
								<span className="font-light text-gray-400">
									{format(startedAt, 'iii')}
								</span>

								<span className="font-medium text-lg">
									{format(startedAt, 'd')}
								</span>
							</time>

							<div className="space-y-1 flex flex-col truncate">
								<h2 className="truncate">{session.name}</h2>

								{!session.exercises.length ? (
									<p className="text-gray-400">
										no exercises
									</p>
								) : (
									session.exercises.map((exercise) => (
										<div key={exercise.id}>
											<p>{exercise.name}</p>
										</div>
									))
								)}

								<div className="w-full text-gray-400">
									<span className="float-right">
										on going: <TimeSince date={startedAt} />
									</span>
								</div>
							</div>
						</a>
					</li>
				);
			})}
		</ul>
	);
}
