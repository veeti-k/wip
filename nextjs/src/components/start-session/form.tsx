import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function StartSessionForm() {
	async function startSession(formData: FormData) {
		'use server';

		const data = Object.fromEntries(formData.entries());

		console.log(data);
	}

	return (
		<form action={startSession} className="space-y-6">
			<div className="space-y-1">
				<Label htmlFor="name">session name</Label>
				<Input id="name" name="name" required />
			</div>

			<div className="flex justify-end gap-2">
				<Button variant="ghost">cancel</Button>
				<Button>start</Button>
			</div>
		</form>
	);
}
