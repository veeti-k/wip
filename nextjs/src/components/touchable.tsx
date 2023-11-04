'use client';

import { cn } from '@/lib/utils';
import { useButton } from '@react-aria/button';
import { motion, useAnimation } from 'framer-motion';
import { useRef, type ComponentProps } from 'react';

export function Touchable({
	className,
	...props
}: ComponentProps<'button'> & {
	onPress?: () => void;
}) {
	const ref = useRef<HTMLButtonElement>(null);
	const controls = useAnimation();

	const aria = useButton(
		{
			...props,
			onPressStart: async () => {
				controls.stop();
				controls.set({ background: 'rgb(40, 40, 40, 1)' });
			},
			onPressEnd: async () => {
				controls.start({
					background: 'rgb(0, 0, 0, 0)',
					transition: { duration: 0.7 },
				});
			},
			onPress: async () => {
				props.onPress?.();
				controls.start({
					background: [null, 'rgb(0, 0, 0, 0)'],
					transition: { duration: 0.7 },
				});
			},
			// @ts-expect-error undocumented prop
			preventFocusOnPress: true,
		},
		ref,
	);

	return (
		// @ts-expect-error not now
		<motion.button
			{...aria.buttonProps}
			animate={controls}
			className={cn(className, 'cursor-default w-full h-full')}
		>
			{props.children}
		</motion.button>
	);
}

export function TouchableLink({ className, ...props }: ComponentProps<'a'>) {
	const ref = useRef<HTMLButtonElement>(null);
	const controls = useAnimation();

	const aria = useButton(
		{
			...props,
			onPressStart: async () => {
				controls.stop();
				controls.set({ background: 'rgb(40, 40, 40, 1)' });
			},
			onPressEnd: async () => {
				controls.start({
					background: 'rgb(0, 0, 0, 0)',
					transition: { duration: 0.7 },
				});
			},
			onPress: async () => {
				controls.start({
					background: [null, 'rgb(0, 0, 0, 0)'],
					transition: { duration: 0.7 },
				});
			},
			// @ts-expect-error undocumented prop
			preventFocusOnPress: true,
		},
		ref,
	);

	return (
		// @ts-expect-error not now
		<motion.a
			href={props.href}
			{...aria.buttonProps}
			animate={controls}
			className={cn(className, ' w-full h-full')}
		>
			{props.children}
		</motion.a>
	);
}
