import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

import { animateOpacityProps } from "~utils/animations";

type Props = { children: ReactNode; title: string };

export function AuthLayout({ children, title }: Props) {
	const router = useRouter();
	const { status } = useSession();

	if (status === "authenticated") router.push("/app");

	return (
		<>
			<Head>
				<title>{`Gym / ${title}`}</title>
			</Head>

			<motion.main
				key={router.pathname}
				className="z-10 mx-auto h-max max-w-page px-3 pb-[11rem] pt-[5rem] sm:pt-[7rem]"
				{...animateOpacityProps}
			>
				{children}
			</motion.main>
		</>
	);
}
