'use server';

import { safeParseAsync } from 'valibot';
import { formatValidationErrors } from './env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function validateFormData(formData: FormData, schema: any) {
	const data = Object.fromEntries(formData.entries());

	const res = await safeParseAsync(schema, data);

	if (!res.success) {
		return {
			success: false,
			errors: formatValidationErrors(res.issues),
		};
	}

	return {
		success: true,
		data: res.output,
	};
}
