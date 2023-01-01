import { Navigate } from "react-router-dom";

import { useAuth } from "~Auth/Auth";

export const IndexPage = () => {
	const { state } = useAuth();

	if (state === "authenticated") {
		return <Navigate to="/app" />;
	} else if (state === "unauthenticated") {
		return <Navigate to="/auth" />;
	}

	return <></>;
};
