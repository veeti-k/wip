import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { AuthLayout } from "~components/Layouts/AuthLayout/AuthLayout";
import { Button } from "~components/Ui/Button";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { Input } from "~components/Ui/Input";
import { PreviewLoginFormType, previewLoginFormSchema } from "~validation/previewLogin";

import { useNextAuthError } from "./useNextAuthError";

export function AuthDevLoginPage() {
	const error = useNextAuthError();

	const form = useForm<PreviewLoginFormType>({
		resolver: zodResolver(previewLoginFormSchema),
		defaultValues: {
			username: "dev",
			password: "",
		},
	});

	function onSubmit(values: PreviewLoginFormType) {
		return signIn("credentials", values);
	}

	return (
		<AuthLayout title="Dev login">
			<div className="flex flex-col gap-10">
				<h1 className="text-center text-5xl font-bold">Gym / Dev login</h1>

				{error && <ErrorCard message={error} />}

				<form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-3">
						<Input
							placeholder="Username"
							autoComplete="username"
							required
							error={form.formState.errors.username?.message}
							{...form.register("username")}
						/>

						<Input
							placeholder="Password"
							type="password"
							required
							error={form.formState.errors.password?.message}
							{...form.register("password")}
						/>
					</div>

					<Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? "Logging in..." : "Login"}
					</Button>
				</form>
			</div>
		</AuthLayout>
	);
}
