import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

import { useAuth } from "~auth/Auth";
import { animateOpacityProps } from "~utils/animations";

type Props = { children: ReactNode; title: string };

export function AuthLayout({ children, title }: Props) {
	const router = useRouter();
	const { state } = useAuth();

	if (state === "authenticated") router.push("/app");

	return (
		<>
			<Head>
				<title>{`Gym / ${title}`}</title>
			</Head>

			<motion.main
				key={router.pathname}
				className="max-w-page z-10 mx-auto h-max px-3 pb-[11rem] pt-[5rem] sm:pt-[7rem]"
				{...animateOpacityProps}
			>
				{children}
			</motion.main>
		</>
	);
}
