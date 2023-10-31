import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { DialogWrapper } from '../../start-session/DialogWrapper';

export default function Page() {
	console.log('modal page');

	async function startSession(formData: FormData) {
		'use server';

		const data = Object.fromEntries(formData.entries());

		console.log(data);
	}

	return (
		<DialogWrapper>
			<form action={startSession} className="space-y-6">
				<div className="space-y-1">
					<Label htmlFor="name">session name</Label>
					<Input id="name" name="name" required />
				</div>

				<div className="flex justify-end gap-2">
					<Button variant="ghost" asChild>
						<Link href={'/app'}>cancel</Link>
					</Button>
					<Button type="submit">start</Button>
				</div>
			</form>
		</DialogWrapper>
	);
}
