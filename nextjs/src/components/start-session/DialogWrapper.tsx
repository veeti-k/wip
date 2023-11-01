'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

export function DialogWrapper({ children }: { children: ReactNode }) {
	const router = useRouter();

	return (
		<Dialog
			open
			onOpenChange={() => {
				router.back();
			}}
		>
			<DialogContent>
				<DialogTitle>start session</DialogTitle>

				{children}
			</DialogContent>
		</Dialog>
	);
}
