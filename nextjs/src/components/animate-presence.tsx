'use client';

import { AnimatePresence, type AnimatePresenceProps } from 'framer-motion';
import { type ReactNode } from 'react';

export function AnimatePresenceWrapped(
	props: AnimatePresenceProps & { children: ReactNode },
) {
	return <AnimatePresence {...props}>{props.children}</AnimatePresence>;
}
