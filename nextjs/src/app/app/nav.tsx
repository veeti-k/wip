'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
	{ id: 'sessions', label: 'sessions', href: '/app/sessions' },
	{ id: 'home', label: 'home', href: '/app' },
	{ id: 'workouts', label: 'workouts', href: '/app/workouts' },
];

export function Nav() {
	const pathname = usePathname();
	const activeLinkId = links.find((l) => pathname.startsWith(l.href))?.id;

	return (
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
	);
}