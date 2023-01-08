import { createContext, useContext } from "react";

export function createCtx<ContextType>() {
	const ctx = createContext<ContextType | undefined>(undefined);

	function useCtx() {
		const c = useContext(ctx);

		if (c === undefined) {
			throw new Error("useCtx must be inside a Provider with a value");
		}

		return c;
	}

	return [useCtx, ctx] as const;
}
