import { motion } from "framer-motion";
import { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import { Card } from "~components/_ui/Cards/Card";
import { ErrorCard } from "~components/_ui/Cards/ErrorCard";
import { AnimatedSuccessIcon } from "~components/_ui/Icons/AnimatedSuccess";
import { Link } from "~components/_ui/Link";
import { setAuth } from "~trpcReact/trpcAuth";
import { trpc } from "~trpcReact/trpcReact";
import { animateOpacityProps } from "~utils/animations";
import { useSetInterval } from "~utils/useSetInterval";

import { AuthPageWrapper } from "../Auth";

export const AuthWaitingPage = () => {
	const navigate = useNavigate();

	const searchParams = new URLSearchParams(useLocation().search);
	const [waiting, setWaiting] = useState(true);
	const [error, setError] = useState(false);

	const token = searchParams.get("waiterToken");
	const email = searchParams.get("email");

	const mutation = trpc.auth.verifyWaiterToken.useMutation({ retry: false });

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

				setWaiting(false);

				setTimeout(() => navigate("/app"), 2000);
			} catch (e) {}
		},
		waiting ? 1000 : null
	);

	return (
		<AuthPageWrapper>
			{waiting ? (
				<Card
					as={motion.div}
					{...animateOpacityProps}
					className="w-full max-w-[280px] rounded-xl"
				>
					<div className="flex flex-col items-center justify-between gap-6 px-2 py-[4rem]">
						<LoaderIcon className="!h-8 !w-8" />

						<h1>Waiting for confirmation...</h1>

						<p className="text-sm font-light">
							An message has been sent to your email. Please click the link in the
							email to confirm your email.
						</p>
					</div>
				</Card>
			) : error ? (
				<div className="flex w-full flex-col gap-2">
					<ErrorCard message="Error verifying link" />

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
