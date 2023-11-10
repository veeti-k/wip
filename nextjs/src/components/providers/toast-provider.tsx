'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

export function ToastProvider() {
	const { resolvedTheme } = useTheme();

	return (
		<Toaster
			position="top-center"
			richColors
			theme={(resolvedTheme ?? 'dark') as 'dark' | 'light' | 'system'}
		/>
	);
}
