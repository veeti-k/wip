import { useRouter } from "next/router";
import type { ReactNode } from "react";

import { createCtx } from "~utils/context";
import { RouterOutputs, trpc } from "~utils/trpc";
import { useIsMounted } from "~utils/useIsMounted";

import { clearAuth } from "./authUtils";

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
	const router = useRouter();
	const isMounted = useIsMounted();

	const { data, isLoading, error } = trpc.auth.info.useQuery(undefined, {
		retry: false,
	});

	function logout() {
		clearAuth();
		if (isMounted) {
			router.push("/auth");
		}
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
