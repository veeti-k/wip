import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({ children }: { children: ReactNode }) {
	const { pending } = useFormStatus();

	return (
		<Button
			type="submit"
			aria-disabled={pending}
			className="inline-flex group-disabled:opacity-50 group-disabled:pointer-events-none"
		>
			<Spinner className="absolute group-enabled:opacity-0 h-[1.2rem]" />

			<span className="sr-only group-enabled:hidden">loading</span>

			<span className="group-disabled:opacity-0">{children}</span>
		</Button>
	);
}
