'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';

export function DialogWrapper({ children }: { children: ReactNode }) {
	const router = useRouter();

	return (
		<Dialog
			open
			onOpenChange={() => {
				console.log('closing');

				router.push('/app');
			}}
		>
			<DialogContent>
				<DialogTitle>start session</DialogTitle>

				{children}
			</DialogContent>
		</Dialog>
	);
}
