import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { is, type BaseSchema, type Output } from 'valibot';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function validateFormData<TSchema extends BaseSchema>(
	formData: FormData,
	schema: TSchema,
): Output<TSchema> {
	const data = Object.fromEntries(formData.entries());

	if (!is(schema, data)) {
		throw new Error('Invalid form data');
	}

	return data;
}
