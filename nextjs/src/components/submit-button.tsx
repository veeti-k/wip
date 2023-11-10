import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { type ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton(props: ComponentProps<typeof Button>) {
	const { pending } = useFormStatus();

	return (
		<Button
			type="submit"
			aria-disabled={pending}
			className="inline-flex group-disabled:opacity-50 group-disabled:pointer-events-none"
			{...props}
		>
			<Spinner className="absolute group-enabled:opacity-0 h-[1.2rem]" />

			<span className="sr-only group-enabled:hidden">loading</span>

			<span className="group-disabled:opacity-0">{props.children}</span>
		</Button>
	);
}
