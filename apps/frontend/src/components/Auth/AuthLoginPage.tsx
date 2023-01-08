import addSeconds from "date-fns/addSeconds";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import { Card } from "~components/_ui/Cards/Card";
import { ErrorCard } from "~components/_ui/Cards/ErrorCard";
import { AnimatedSuccessIcon } from "~components/_ui/Icons/AnimatedSuccess";
import { Link } from "~components/_ui/Link";
import { setAuth } from "~trpcReact/trpcAuth";
import { trpc } from "~trpcReact/trpcReact";
import { animateOpacityProps } from "~utils/animations";
import { lazyWithPreload } from "~utils/lazyWithPreload";

import { AuthPageWrapper } from "./Auth";

const AppIndexPage = lazyWithPreload(() =>
	import("~components/App/AppIndexPage/AppIndexPage").then((mod) => ({
		default: mod.AppIndexPage,
	}))
);

export function AuthLoginPage() {
	const trpcCtx = trpc.useContext();
	const navigate = useNavigate();
	const searchParams = new URLSearchParams(useLocation().search);

	const accessToken = searchParams.get("access_token");
	const expiresIn = searchParams.get("expires_in");

	const [state, setState] = useState<"loggingIn" | "error" | "loggedIn">("loggingIn");

	useEffect(() => {
		setState("loggingIn");

		if (!accessToken || !expiresIn) {
			return setState("error");
		}

		setAuth({
			accessToken,
			expiresAt: addSeconds(new Date(), Number(expiresIn)),
		});

		AppIndexPage.preload();

		setTimeout(() => {
			setState("loggedIn");

			setTimeout(async () => {
				await trpcCtx.auth.invalidate();
				navigate("/app");
			}, 1700);
		}, 1000);
	}, [accessToken, expiresIn]);

	return (
		<AuthPageWrapper>
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

					<Link to="/auth">Back to login</Link>
				</div>
			) : (
				<Card className="w-full max-w-[280px] rounded-xl">
					<div className="flex flex-col items-center justify-between gap-6 px-2 py-[4rem]">
						<AnimatedSuccessIcon />

						<h1>Logged in!</h1>
					</div>
				</Card>
			)}
		</AuthPageWrapper>
	);
}
