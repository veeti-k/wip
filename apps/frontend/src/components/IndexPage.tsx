import { Navigate } from "react-router-dom";

import { useAuth } from "~Auth/Auth";

export function IndexPage() {
	const { state } = useAuth();

	if (state === "authenticated") {
		return <Navigate to="/app" />;
	} else if (state === "unauthenticated") {
		return <Navigate to="/auth" />;
	}

	return <></>;
}
