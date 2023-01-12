import type { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

import { createCtx } from "~utils/context";
import { useIsMounted } from "~utils/useIsMounted";

import { clearAuth } from "./authUtils";

type ContextType = {
	state: "loading" | "authenticated" | "unauthenticated";
	info?: Session | null;

	logout: () => void;
};

const [useContextInner, Context] = createCtx<ContextType>();

export function useAuth() {
	return useContextInner();
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const router = useRouter();
	const isMounted = useIsMounted();

	const { data, status } = useSession();

	if (data?.signout) signOut();

	function logout() {
		clearAuth();
		if (isMounted) {
			router.push("/auth");
		}
	}

	return (
		<Context.Provider
			value={{
				state: status,

				info: data,

				logout,
			}}
		>
			{children}
		</Context.Provider>
	);
}
