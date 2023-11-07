'use client';

import { createSession } from '@/lib/db/actions/session';
import { useDialog } from '@/lib/use-dialog';
import { Button } from '../components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Fieldset } from './fieldset';
import { SubmitButton } from './submit-button';

export function StartSession() {
	const dialog = useDialog();

	return (
		<Dialog {...dialog.props}>
			<DialogTrigger asChild>
				<Button className="w-full">start session</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>start session</DialogTitle>

				<form action={createSession}>
					<Fieldset className="space-y-6 group">
						<div className="space-y-1">
							<Label htmlFor="name">session name</Label>
							<Input id="name" name="name" required />
						</div>

						<div className="flex justify-end gap-2">
							<Button type="button" variant="ghost">
								cancel
							</Button>
							<SubmitButton>start</SubmitButton>
						</div>
					</Fieldset>
				</form>
			</DialogContent>
		</Dialog>
	);
}
