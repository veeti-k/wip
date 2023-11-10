import { getOptionalUserId } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';
import { Nav } from './nav';

export default async function Layout({ children }: { children: ReactNode }) {
	const userId = await getOptionalUserId();
	if (!userId) {
		redirect('/auth');
	}

	return (
		<div className="fixed w-full h-full flex justify-center items-center p-4">
			<div className="max-w-[380px] max-h-[600px] w-full h-full justify-center flex items-center flex-col gap-2">
				<main className="w-full h-full flex flex-col rounded-3xl border overflow-hidden">
					{children}
				</main>

				<Nav />
			</div>
		</div>
	);
}
