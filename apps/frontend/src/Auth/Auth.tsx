import type { ReactNode } from "react";

import type { RouterOutputs } from "@gym/api";

import { clearAuth } from "~trpcReact/trpcAuth";
import { trpc } from "~trpcReact/trpcReact";
import { createCtx } from "~utils/context";

import { useLogin } from "./useLogin";

type ContextType = {
	state: "loading" | "authenticated" | "unauthenticated";
	info?: RouterOutputs["auth"]["info"];

	initLogin: (email: string) => Promise<void>;
	logout: () => Promise<void>;
};

const [useContextInner, Context] = createCtx<ContextType>();

export const useAuth = () => useContextInner();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { data, isLoading, error } = trpc.auth.info.useQuery(undefined, {
		retry: false,
	});
	const { magicLinkLogin } = useLogin();

	const initLogin = async (email: string) => {
		await magicLinkLogin(email);
	};

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

				initLogin,
				logout,
			}}
		>
			{children}
		</Context.Provider>
	);
};
