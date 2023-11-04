import { Button } from '@/components/ui/button';
import { getUserId } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { dbSession } from '@/lib/db/schema';
import { format } from 'date-fns';
import { eq } from 'drizzle-orm';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { unstable_cache } from 'next/cache';
import { Suspense } from 'react';

export default async function Page() {
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

				<Button size="default" variant={'secondary'} className="w-full">
					{format(new Date(), 'MMMM yyyy')}
				</Button>

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
			db.query.session.findMany({
				where: eq(dbSession.userId, userId),
				with: { exercises: true },
				orderBy: (t, { desc }) => desc(t.createdAt),
			}),
		['onGoingSessions', userId],
		{ tags: ['sessions'] },
	)();

	return !sessions.length ? (
		<p className="px-4 py-2 border-b w-full">no sessions</p>
	) : (
		<ul className="divide-y border-b">
			{sessions.map((session) => (
				<li key={session.id}>
					<a
						href={`/app/sessions/${session.id}`}
						className="py-2 px-4 flex gap-4"
					>
						<div className="text-center">
							<p className="font-light text-gray-400">
								{format(new Date(session.startedAt), 'iii')}
							</p>

							<p className="font-medium text-lg">
								{format(new Date(session.startedAt), 'd')}
							</p>
						</div>

						<div className="space-y-2 flex items-start flex-col">
							<h2>{session.name}</h2>

							{!session.exercises.length ? (
								<p className="text-gray-400">no exercises</p>
							) : (
								session.exercises.map((exercise) => (
									<div key={exercise.id}>
										<p>{exercise.name}</p>
									</div>
								))
							)}
						</div>
					</a>
				</li>
			))}
		</ul>
	);
}
