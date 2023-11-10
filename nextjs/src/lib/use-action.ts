'use client';

import { startTransition, useReducer } from 'react';

export function useAction<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TAction extends (...params: any[]) => Promise<any>,
	TParams extends Parameters<TAction>,
	TData extends Awaited<ReturnType<TAction>>,
>(action: TAction) {
	function reducer<TData>(state: State<TData>, action: Action<TData>) {
		switch (action.type) {
			case 'success':
				return { ...state, data: action.payload, isLoading: false };
			case 'error':
				return { ...state, error: action.payload, isLoading: false };
			case 'loading':
				return { ...state, isLoading: true };
			default:
				throw new Error('invalid action type');
		}
	}

	const [state, dispatch] = useReducer(reducer, {
		data: undefined,
		error: undefined,
		isLoading: false,
		isError: false,
	});

	function exec(...p: TParams) {
		return new Promise<TData>((resolve, reject) => {
			dispatch({ type: 'loading' });

			startTransition(() => {
				action(...p)
					.then((data) => {
						dispatch({ type: 'success', payload: data });
						resolve(data);
					})
					.catch((error) => {
						dispatch({ type: 'error', payload: error });
						reject(error);
					});
			});
		});
	}

	return { exec, isLoading: state.isLoading, isError: state.isError };
}

type SuccessAction<TPayload> = {
	type: 'success';
	payload: TPayload;
};

type ErrorAction<TPayload> = {
	type: 'error';
	payload: TPayload;
};

type LoadingAction = {
	type: 'loading';
};

type Action<TData> = SuccessAction<TData> | ErrorAction<TData> | LoadingAction;

type State<TData = unknown> = {
	data: TData | undefined;
	error: unknown | undefined;
	isLoading: boolean;
	isError: boolean;
};
