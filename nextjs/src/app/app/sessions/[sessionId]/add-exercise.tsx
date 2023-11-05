'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useDialog } from '@/lib/use-dialog';

export function AddExercise() {
	const dialog = useDialog();

	return (
		<Dialog {...dialog.props}>
			<DialogTrigger asChild>
				<Button className="w-full" variant={'secondary'}>
					add exercise
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>add exercise</DialogTitle>
			</DialogContent>
		</Dialog>
	);
}
