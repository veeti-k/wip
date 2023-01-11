import { useRouter } from "next/router";

import { useAuth } from "~auth/Auth";
import { useIsMounted } from "~utils/useIsMounted";

export default function Index() {
	const { state } = useAuth();
	const isMounted = useIsMounted();
	const router = useRouter();

	if (state === "authenticated") {
		if (isMounted) {
			router.push("/app");
		}
	} else if (state === "unauthenticated") {
		if (isMounted) {
			router.push("/auth");
		}
	}

	return null;
}
