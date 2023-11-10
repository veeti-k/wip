import { type ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';

export function Fieldset(
	props: Omit<ComponentProps<'fieldset'>, 'disabled' | 'aria-disabled'>,
) {
	const { pending } = useFormStatus();

	return <fieldset disabled={pending} {...props} />;
}
