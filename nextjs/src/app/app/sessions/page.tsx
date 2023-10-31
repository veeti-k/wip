import { getUserId } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { session } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export default async function Page() {
	return (
		<>
			<div className="h-15 pl-4 pr-3 border-b flex justify-between items-center">
				<h1 className="text-lg font-medium">sessions</h1>
			</div>

			<SessionList />
		</>
	);
}

async function SessionList() {
	const userId = await getUserId();
	const sessions = await unstable_cache(
		() =>
			db.query.session.findMany({
				where: eq(session.userId, userId),
			}),
		['sessions'],
	)();

	return !sessions.length ? (
		<p className="px-4 py-2 border-b w-full">no sessions</p>
	) : (
		sessions.map((session) => (
			<div key={session.id} className="p-2 bg-white rounded-md shadow-md">
				<div className="flex justify-between">
					<h2 className="text-lg font-light">{session.id}</h2>
				</div>
			</div>
		))
	);
}
