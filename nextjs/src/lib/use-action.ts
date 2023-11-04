'use client';

import { useState, useTransition } from 'react';

export function useAction<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TAction extends (...params: any[]) => any,
	TParams extends Parameters<TAction>,
	TData extends Awaited<ReturnType<TAction>>,
>(action: TAction) {
	const [isLoading, startTransition] = useTransition();
	const [error, setError] = useState<unknown>();
	const [data, setData] = useState<TData>();

	function exec(...p: TParams) {
		return new Promise<
			{ data: TData } | { error: Exclude<unknown, undefined> }
		>((resolve) => {
			startTransition(async () => {
				try {
					setError(undefined);
					const data = await action(...p);
					resolve({ data });
					setData(data);
				} catch (error) {
					setError(error);
					setData(undefined);
					resolve({ error });
				}
			});
		});
	}

	return { exec, loading: isLoading, error, data };
}
