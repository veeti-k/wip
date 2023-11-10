'use server';

import { is, type BaseSchema, type Output } from 'valibot';

export async function validateFormData<TSchema extends BaseSchema>(
	formData: FormData,
	schema: TSchema,
): Promise<Output<TSchema>> {
	const data = Object.fromEntries(formData.entries());

	if (!is(schema, data)) {
		throw new Error('Invalid form data');
	}

	return data;
}
