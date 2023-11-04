'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';

const links = [
	{ id: 'sessions', label: 'sessions', href: '/app/sessions' },
	{ id: 'home', label: 'home', href: '/app' },
	{ id: 'workouts', label: 'workouts', href: '/app/workouts' },
];

export default function Layout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const activeLinkId = links.find((l) => pathname.startsWith(l.href))?.id;

	return (
		<div className="fixed w-full h-full flex justify-center items-center p-4">
			<div className="max-w-[380px] max-h-[600px] w-full h-full justify-center flex items-center flex-col gap-2">
				<main className="w-full h-full flex flex-col rounded-3xl border overflow-hidden">
					{children}
				</main>

				<nav className="p-2 gap-2 flex max-w-max border rounded-full">
					{links.map((l) => (
						<Link
							key={l.id}
							href={l.href}
							className="relative flex w-full items-center justify-center rounded-full px-4 py-2 outline-none outline-2 outline-offset-2 transition-[outline,opacity] duration-200 focus-visible:outline-gray-300"
						>
							{activeLinkId === l.id && (
								<motion.div
									layoutId="active-indicator"
									className="absolute inset-0 w-full rounded-full border bg-gray-900"
									transition={{
										duration: 0.1,
										type: 'spring',
										mass: 0.1,
									}}
								/>
							)}
							<span className="relative">{l.label}</span>
						</Link>
					))}
				</nav>
			</div>
		</div>
	);
}
