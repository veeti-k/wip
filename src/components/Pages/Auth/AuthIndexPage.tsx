import { AuthLayout } from "~components/Layouts/AuthLayout/AuthLayout";
import { ButtonA } from "~components/Ui/Button";

export function AuthIndexPage() {
	return (
		<AuthLayout title="Login">
			<h1 className="mb-10 text-center text-5xl font-bold">Gym / Login</h1>

			<ButtonA href={`/api/google-auth/init`} className="w-full">
				Login with Google
			</ButtonA>
		</AuthLayout>
	);
}
