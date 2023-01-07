import { AnimatePresence, motion } from "framer-motion";
import { ComponentProps, Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "~Auth/Auth";
import { animateOpacityProps } from "~utils/animations";
import { classNames } from "~utils/classNames";

import { NavBar } from "./NavBar";

export const App = () => {
	const { state } = useAuth();
	const location = useLocation();

	if (state === "loading") {
		return <></>;
	} else if (state === "unauthenticated") {
		return <Navigate to="/auth" />;
	} else {
		return (
			<>
				<NavBar />

				<AnimatePresence key={location.pathname}>
					<Suspense>
						<Outlet />
					</Suspense>
				</AnimatePresence>
			</>
		);
	}
};

export const AppPageWrapper = ({
	children,
	className,
	...props
}: ComponentProps<typeof motion.main>) => {
	const location = useLocation();

	return (
		<motion.main
			key={location.pathname}
			className={classNames(
				"max-w-page mx-auto h-max px-3 pb-[11rem] pt-[5rem] sm:pt-[7rem]",
				className
			)}
			{...animateOpacityProps}
			{...props}
		>
			{children}
		</motion.main>
	);
};
