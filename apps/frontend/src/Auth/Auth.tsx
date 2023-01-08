import type { ReactNode } from "react";

import type { RouterOutputs } from "@gym/api";

import { clearAuth } from "~trpcReact/trpcAuth";
import { trpc } from "~trpcReact/trpcReact";
import { createCtx } from "~utils/context";

type ContextType = {
	state: "loading" | "authenticated" | "unauthenticated";
	info?: RouterOutputs["auth"]["info"];

	logout: () => Promise<void>;
};

const [useContextInner, Context] = createCtx<ContextType>();

export const useAuth = () => useContextInner();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { data, isLoading, error } = trpc.auth.info.useQuery(undefined, {
		retry: false,
	});

	const logout = async () => {
		clearAuth();
		window.location.href = "/auth";
	};

	return (
		<Context.Provider
			value={{
				state: isLoading
					? "loading"
					: error
					? "unauthenticated"
					: data
					? "authenticated"
					: "unauthenticated",
				info: data,

				logout,
			}}
		>
			{children}
		</Context.Provider>
	);
};
