import { motion } from "framer-motion";

import { errorCardStuff } from "~utils/animations";
import { classNames } from "~utils/classNames";

import { Card } from "./Card";

type Props = {
	message: string;
	className?: string;
};

export function ErrorCard({ message, className }: Props) {
	return (
		<Card
			as={motion.div}
			{...errorCardStuff}
			className={classNames(
				"flex items-center justify-center rounded-xl px-3 py-5 font-light",
				className
			)}
		>
			{message}
		</Card>
	);
}
