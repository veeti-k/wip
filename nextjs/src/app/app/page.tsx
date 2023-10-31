import { Button } from '@/components/ui/button';
import { getUserId } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { session } from '@/lib/db/schema';
import { and, eq, isNull, lte } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function Page() {
	return (
		<>
			<div className="h-15 pl-4 pr-3 border-b flex justify-between items-center">
				<h1 className="text-lg font-medium">home</h1>

				<Button asChild>
					<Link href={'/app/start-session'}>start session</Link>
				</Button>
			</div>

			<Suspense
				fallback={
					<p className="py-2 px-4 border-b">
						getting on going sessions...
					</p>
				}
			>
				<OnGoingSessions />
			</Suspense>
		</>
	);
}

export async function OnGoingSessions() {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const userId = await getUserId();
	const onGoingSessions = await unstable_cache(
		() =>
			db.query.session.findMany({
				where: and(
					eq(session.userId, userId),
					lte(session.startedAt, new Date()),
					isNull(session.stoppedAt),
				),
			}),
		['onGoingSessions', 'sessions'],
	)();

	return !onGoingSessions.length ? (
		<p className="px-4 py-2 border-b w-full">no on going sessions</p>
	) : (
		onGoingSessions.map((session) => (
			<div key={session.id} className="p-2 bg-white rounded-md shadow-md">
				<div className="flex justify-between">
					<h2 className="text-lg font-light">{session.id}</h2>
				</div>
			</div>
		))
	);
}
