import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
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

					position: "top-right",
				}}
			/>

			<Component {...pageProps} />
		</SessionProvider>
	);
};

export default trpc.withTRPC(MyApp);
