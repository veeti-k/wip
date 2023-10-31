import { signIn } from "next-auth/react";

import { AuthLayout } from "~components/Layouts/AuthLayout/AuthLayout";
import { Button } from "~components/Ui/Button";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";

import { useNextAuthError } from "./useNextAuthError";

export function AuthIndexPage() {
	const error = useNextAuthError();

	return (
		<AuthLayout title="Login">
			<div className="flex flex-col gap-10">
				<h1 className="text-center text-5xl font-bold">Gym / Login</h1>

				{error && <ErrorCard message={error} />}

				<Button onClick={() => signIn("google")} className="w-full">
					Login with Google
				</Button>
			</div>
		</AuthLayout>
	);
}
