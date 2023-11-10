'use client';

import { Fieldset } from '@/components/fieldset';
import { SpinnerButton } from '@/components/spinner-button';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteSession } from '@/lib/db/actions/session';
import { type DbSession } from '@/lib/db/schema';
import { useDialog } from '@/lib/use-dialog';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';

export function DeleteSession(props: { session: DbSession }) {
	const dialog = useDialog();

	const [formState, formAction] = useFormState(
		deleteSession.bind(null, props.session.id),
		{ error: null, success: null, data: '' },
	);

	useEffect(() => {
		if (formState.success === false) {
			toast.error(`error deleting session`, {
				description: formState.error,
			});
		} else if (formState.success === true) {
			toast.success(`session deleted`);
			dialog.close();
		}
	}, [formState]);

	return (
		<Dialog {...dialog.props}>
			<DialogTrigger asChild>
				<DropdownMenuItem
					onSelect={(e) => {
						e.preventDefault();
						dialog.open();
					}}
				>
					delete
				</DropdownMenuItem>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>delete session</DialogTitle>

				<p>delete {props.session.name}?</p>

				<div className="flex justify-end gap-3">
					<DialogClose asChild>
						<Button variant="ghost">cancel</Button>
					</DialogClose>

					<form action={formAction}>
						<Fieldset className="group aria-disabled:opacity-50 aria-disabled:pointer-events-none">
							<legend className="sr-only">delete session</legend>

							<SpinnerButton
								type="submit"
								variant="destructive"
								spinnerText="deleting"
							>
								delete
							</SpinnerButton>
						</Fieldset>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
