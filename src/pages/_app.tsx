import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

import { DevMenu } from "~components/DevMenu/DevMenu";
import { env } from "~env/client.mjs";
import { colors } from "~utils/colors";
import { trpc } from "~utils/trpc";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
				/>
				<link rel="icon" href="/icons/favicon.ico" />

				<link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png"></link>

				<meta name="theme-color" content="#161615" />
			</Head>

			<SessionProvider session={session}>
				{env.NEXT_PUBLIC_ENV !== "production" && <DevMenu />}

				<Toaster
					reverseOrder
					toastOptions={{
						style: {
							background: colors.p[1000],
							border: `1px solid ${colors.p[800]}`,
							color: colors.p[100],
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							padding: "1rem",
							gap: "0.3rem",
							fontWeight: 500,
							lineHeight: 1,
						},

						duration: 5000,
						position: "top-right",
					}}
				/>

				<Component {...pageProps} />
			</SessionProvider>
		</>
	);
};

export default trpc.withTRPC(MyApp);
