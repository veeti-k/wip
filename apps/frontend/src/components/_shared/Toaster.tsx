import { Toaster as ActualToaster } from "react-hot-toast";

import { colors } from "~utils/colors";

export function Toaster() {
	return (
		<ActualToaster
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
	);
}
