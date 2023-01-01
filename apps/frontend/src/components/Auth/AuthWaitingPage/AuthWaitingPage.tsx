import { motion } from "framer-motion";
import { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import { Card } from "~components/_ui/Card";
import { AnimatedSuccessIcon } from "~components/_ui/Icons/AnimatedSuccess";
import { Link } from "~components/_ui/Link";
import { setAuth } from "~trpcReact/trpcAuth";
import { trpc } from "~trpcReact/trpcReact";
import { errorCardStuff } from "~utils/animations";
import { useSetInterval } from "~utils/useSetInterval";

import { AuthPageWrapper } from "../Auth";

export const AuthWaitingPage = () => {
	const navigate = useNavigate();

	const searchParams = new URLSearchParams(useLocation().search);
	const [waiting, setWaiting] = useState(true);
	const [error, setError] = useState(false);

	const token = searchParams.get("waiterToken");
	const email = searchParams.get("email");

	const mutation = trpc.auth.verifyWaiterToken.useMutation({ retry: true });

	useSetInterval(
		async () => {
			if (!token || !email) {
				console.error("Error verifying waiter token - missing token or email");

				setWaiting(false);
				return setError(true);
			}

			try {
				const { accessToken, expiresAt } = await mutation.mutateAsync({
					token,
					email,
				});

				setAuth({
					accessToken,
					expiresAt,
				});

				navigate("/app");
			} catch (e) {}
		},
		waiting ? 1000 : null
	);

	return (
		<AuthPageWrapper>
			{waiting ? (
				<Card className="w-full max-w-[280px] rounded-xl">
					<div className="flex flex-col items-center justify-between gap-6 px-2 py-[4rem]">
						<LoaderIcon className="!h-8 !w-8" />

						<h1>Waiting...</h1>
					</div>
				</Card>
			) : error ? (
				<div className="flex w-full flex-col gap-2">
					<Card as={motion.div} {...errorCardStuff} className="rounded-xl">
						<div className="flex flex-col items-center justify-between gap-6 px-2 py-[4rem]">
							<h1 className="text-xl">Error verifying link</h1>
						</div>
					</Card>

					<Link to="/auth">Back to login</Link>
				</div>
			) : (
				<Card className="w-full max-w-[280px] rounded-xl">
					<div className="flex flex-col items-center justify-between gap-6 px-2 py-[4rem]">
						<AnimatedSuccessIcon />

						<h1>Logged in</h1>
					</div>
				</Card>
			)}
		</AuthPageWrapper>
	);
};
