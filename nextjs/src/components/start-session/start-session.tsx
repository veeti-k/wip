'use client';

import { useAction } from '@/lib/use-action';
import { useDialog } from '@/lib/use-dialog';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { startSessionWithValidation } from './action';

export function StartSession() {
	const dialog = useDialog();
	const action = useAction(startSessionWithValidation);

	return (
		<Dialog {...dialog.props}>
			<DialogTrigger asChild>
				<Button className="w-full">start session</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>start session</DialogTitle>

				<form action={action.exec} className="space-y-6">
					<div className="space-y-1">
						<Label htmlFor="name">session name</Label>
						<Input id="name" name="name" required />
					</div>

					<div className="flex justify-end gap-2">
						<Button type="button" variant="ghost">
							cancel
						</Button>
						<Button type="submit">start</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
