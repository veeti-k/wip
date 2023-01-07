import { AnimatePresence, motion } from "framer-motion";
import { ComponentProps, Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "~Auth/Auth";
import { animateOpacityProps } from "~utils/animations";
import { classNames } from "~utils/classNames";

export const Auth = () => {
	const { state } = useAuth();
	const location = useLocation();

	if (state === "loading") return <></>;

	if (state === "authenticated" && !location.pathname.includes("magic")) {
		return <Navigate to="/app" />;
	}

	return (
		<AnimatePresence initial={false}>
			<Suspense>
				<Outlet />
			</Suspense>
		</AnimatePresence>
	);
};

export const AuthPageWrapper = ({
	children,
	className,
	...props
}: ComponentProps<typeof motion.main>) => {
	const location = useLocation();

	return (
		<motion.main
			key={location.pathname}
			className={classNames(
				"max-w-page mx-auto h-max px-3 pb-[6rem] pt-[5rem] sm:pt-[7rem]",
				className
			)}
			{...animateOpacityProps}
			{...props}
		>
			{children}
		</motion.main>
	);
};
