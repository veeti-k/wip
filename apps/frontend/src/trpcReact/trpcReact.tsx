import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { ReactNode, useState } from "react";
import superjson from "superjson";

import type { AppRouter } from "@gym/api";

import { env } from "~utils/envs";

import { getAuth } from "./trpcAuth";

export const trpc = createTRPCReact<AppRouter>();

export const TRPCProvider = ({ children }: { children: ReactNode }) => {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			transformer: superjson,
			links: [
				httpBatchLink({
					url: `${env.API_BASE_URL}/trpc`,
					headers() {
						const accessToken = getAuth()?.accessToken;

						return {
							...(accessToken && { Authorization: `Bearer ${accessToken}` }),
						};
					},
				}),
			],
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
};
