import addSeconds from "date-fns/addSeconds";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";

import { setAuth } from "~auth/authUtils";
import { AuthLayout } from "~components/Layouts/AuthLayout/AuthLayout";
import { Card } from "~components/Ui/Cards/Card";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { AnimatedSuccessIcon } from "~components/Ui/Icons/AnimatedSuccess";
import { Link } from "~components/Ui/Link";
import { animateOpacityProps } from "~utils/animations";
import { trpc } from "~utils/trpc";

export function AuthLoginPage() {
	const router = useRouter();
	const trpcCtx = trpc.useContext();
	const searchParams = router.query;

	const accessToken = searchParams["accessToken"];
	const expiresIn = searchParams["expiresIn"];

	const [state, setState] = useState<"loggingIn" | "error" | "loggedIn">("loggingIn");

	useEffect(() => {
		setState("loggingIn");

		if (
			!accessToken ||
			!expiresIn ||
			typeof accessToken !== "string" ||
			typeof expiresIn !== "string"
		) {
			return setState("error");
		}

		setAuth({
			accessToken,
			expiresAt: addSeconds(new Date(), Number(expiresIn)),
		});

		setTimeout(() => {
			setState("loggedIn");

			setTimeout(async () => {
				await trpcCtx.auth.invalidate();
				router.push("/app");
			}, 1700);
		}, 1000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accessToken, expiresIn]);

	return (
		<AuthLayout title="Login">
			{state === "loggingIn" ? (
				<Card
					as={motion.div}
					{...animateOpacityProps}
					className="w-full max-w-[280px] rounded-xl"
				>
					<div className="flex flex-col items-center justify-between gap-6 px-2 py-[4rem]">
						<LoaderIcon className="!h-8 !w-8" />

						<h1>Logging in...</h1>
					</div>
				</Card>
			) : state === "error" ? (
				<div className="flex w-full flex-col gap-2">
					<ErrorCard message="Error logging in" />

					<Link href="/auth">Back to login</Link>
				</div>
			) : (
				<Card className="w-full max-w-[280px] rounded-xl">
					<div className="flex flex-col items-center justify-between gap-6 px-2 py-[4rem]">
						<AnimatedSuccessIcon />

						<h1>Logged in!</h1>
					</div>
				</Card>
			)}
		</AuthLayout>
	);
}
