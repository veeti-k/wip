'use client';

import { motion, type MotionProps } from 'framer-motion';
import Link, { type LinkProps } from 'next/link';
import { type ReactNode } from 'react';

const MotionNextLink = motion(Link);

export const MotionLink = (
	props: LinkProps & MotionProps & { children: ReactNode },
) => {
	return (
		// @ts-expect-error not now
		<MotionNextLink
			{...props}
			initial={{ height: 0, opacity: 0 }}
			animate={{ height: 'auto', opacity: 1 }}
			exit={{ height: 0, opacity: 0 }}
			className="overflow-hidden"
		/>
	);
};
