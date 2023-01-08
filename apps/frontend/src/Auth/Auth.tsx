import type { ReactNode } from "react";

import type { RouterOutputs } from "@gym/api";

import { clearAuth } from "~trpcReact/trpcAuth";
import { trpc } from "~trpcReact/trpcReact";
import { createCtx } from "~utils/context";

type ContextType = {
	state: "loading" | "authenticated" | "unauthenticated";
	info?: RouterOutputs["auth"]["info"];

	logout: () => void;
};

const [useContextInner, Context] = createCtx<ContextType>();

export function useAuth() {
	return useContextInner();
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const { data, isLoading, error } = trpc.auth.info.useQuery(undefined, {
		retry: false,
	});

	function logout() {
		clearAuth();
		window.location.href = "/auth";
	}

	return (
		<Context.Provider
			value={{
				state: isLoading ? "loading" : error ? "unauthenticated" : "authenticated",

				info: data,

				logout,
			}}
		>
			{children}
		</Context.Provider>
	);
}
