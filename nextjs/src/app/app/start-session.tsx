'use client';

import { SpinnerButton } from '@/components/spinner-button';
import { createSession } from '@/lib/db/actions/session';
import { useAction } from '@/lib/use-action';
import { useDialog } from '@/lib/use-dialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Fieldset } from '../../components/fieldset';
import { Button } from '../../components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export function StartSession() {
	const dialog = useDialog();
	const action = useAction(createSession);
	const router = useRouter();

	return (
		<Dialog {...dialog.props}>
			<DialogTrigger asChild>
				<Button className="w-full">start session</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>start session</DialogTitle>

				<form
					action={(formData) => {
						action
							.exec(formData)
							.then(({ sessionId }) => {
								toast.success('session started');
								router.push(`/app/sessions/${sessionId}`);
							})
							.catch(() => {
								toast.error('error starting session');
							});
					}}
				>
					<Fieldset className="space-y-6 group">
						<div className="space-y-1">
							<Label htmlFor="name">session name</Label>
							<Input id="name" name="name" required />
						</div>

						<div className="flex justify-end gap-2">
							<Button type="button" variant="ghost">
								cancel
							</Button>
							<SpinnerButton type="submit" spinnerText="starting">
								start
							</SpinnerButton>
						</div>
					</Fieldset>
				</form>
			</DialogContent>
		</Dialog>
	);
}
