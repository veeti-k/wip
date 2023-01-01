import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderIcon, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "~components/_ui/Button";
import { Input } from "~components/_ui/Input";
import { trpc } from "~trpcReact/trpcReact";

export const AuthLoginPage = () => {
	const navigate = useNavigate();
	const mutation = trpc.auth.initiateMagicLink.useMutation();

	const form = useForm({
		resolver: zodResolver(
			z.object({
				email: z.string().min(1, { message: "Required" }).email(),
			})
		),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (values: { email: string }) => {
		toast
			.promise(mutation.mutateAsync({ email: values.email }), {
				loading: "Sending magic link...",
				success: "Magic link sent!",
				error: "Error sending magic link",
			})
			.then((res) => {
				if (res?.waiterToken) {
					navigate(`/auth/wait?waiterToken=${res.waiterToken}&email=${values.email}`);
				}
			});
	};

	return (
		<main className="mx-auto mt-[10rem] flex max-w-[280px] flex-col">
			<h1 className="mb-10 text-center text-5xl font-bold">Login</h1>

			<form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)} noValidate>
				<Input
					label="Email"
					required
					error={form.formState.errors.email?.message}
					{...form.register("email")}
				/>
				<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting ? (
						<LoaderIcon className="mx-2 !h-6 !w-6" />
					) : (
						"Login"
					)}
				</Button>
			</form>
		</main>
	);
};
