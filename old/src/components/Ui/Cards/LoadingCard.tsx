import { motion } from "framer-motion";

import { animateOpacityProps } from "~utils/animations";
import { classNames } from "~utils/classNames";

import { Card } from "./Card";

type Props = {
	message: string;
	myKey?: string;
	className?: string;
};

export function LoadingCard({ message, myKey, className }: Props) {
	return (
		<Card
			key={myKey}
			as={motion.div}
			{...animateOpacityProps}
			className={classNames(
				"flex animate-pulse items-center justify-center rounded-xl px-3 py-5 font-light",
				className
			)}
		>
			{message}
		</Card>
	);
}
