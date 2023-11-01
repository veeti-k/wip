'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { type UseDialog } from '@/lib/use-dialog';
import { type ReactNode } from 'react';

export function StartSessionDialog({
	children,
	dialog,
}: {
	children: ReactNode;
	dialog: UseDialog;
}) {
	return (
		<Dialog {...dialog.props}>
			<DialogTrigger asChild>
				<Button size="sm">start session</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>start a session</DialogTitle>

				{children}
			</DialogContent>
		</Dialog>
	);
}
