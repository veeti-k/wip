import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useIsMounted } from "~utils/useIsMounted";

export default function Index() {
	const { status } = useSession();
	const isMounted = useIsMounted();
	const router = useRouter();

	if (status === "authenticated") {
		if (isMounted) {
			router.push("/app");
		}
	} else if (status === "unauthenticated") {
		if (isMounted) {
			router.push("/auth");
		}
	}

	return null;
}
