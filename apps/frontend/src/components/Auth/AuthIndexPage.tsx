import { ButtonA } from "~components/_ui/Button";
import { env } from "~utils/envs";
import { useTitle } from "~utils/useTitle";

import { AuthPageWrapper } from "./Auth";

export function AuthIndexPage() {
	useTitle("Login");

	return (
		<AuthPageWrapper>
			<h1 className="mb-10 text-center text-5xl font-bold">Gym / Login</h1>

			<ButtonA href={`${env.API_BASE_URL}/google-auth/init`} className="w-full">
				Login with Google
			</ButtonA>
		</AuthPageWrapper>
	);
}
