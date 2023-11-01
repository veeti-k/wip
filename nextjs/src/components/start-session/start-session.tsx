'use client';

import { useDialog } from '@/lib/use-dialog';
import { StartSessionDialog } from './dialog';
import { StartSessionForm } from './form';

export function StartSession() {
	const dialog = useDialog();

	return (
		<StartSessionDialog dialog={dialog}>
			<StartSessionForm />
		</StartSessionDialog>
	);
}
