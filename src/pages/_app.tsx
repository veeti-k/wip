import type { AppType } from "next/app";

import { AuthProvider } from "~auth/Auth";
import { trpc } from "~utils/trpc";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<AuthProvider>
			<Component {...pageProps} />
		</AuthProvider>
	);
};

export default trpc.withTRPC(MyApp);
