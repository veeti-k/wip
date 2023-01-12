import type { AppType } from "next/app";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "~auth/Auth";
import { colors } from "~utils/colors";
import { trpc } from "~utils/trpc";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<AuthProvider>
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
		</AuthProvider>
	);
};

export default trpc.withTRPC(MyApp);
