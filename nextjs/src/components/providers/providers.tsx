'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { ToastProvider } from './toast-provider';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<>
			<ToastProvider />

			<ThemeProvider>{children}</ThemeProvider>
		</>
	);
}
