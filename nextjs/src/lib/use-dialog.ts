'use client';

import { useState } from 'react';

export function useDialog() {
	const [isOpen, setIsOpen] = useState(false);

	return {
		open: () => setIsOpen(true),
		close: () => setIsOpen(false),
		props: {
			isOpen,
			onOpenChange: setIsOpen,
		},
	};
}

export type UseDialog = ReturnType<typeof useDialog>;
