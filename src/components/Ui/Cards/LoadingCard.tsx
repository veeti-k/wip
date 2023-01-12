import { motion } from "framer-motion";

import { animateOpacityProps } from "~utils/animations";

import { Card } from "./Card";

type Props = {
	message: string;
	myKey?: string;
};

export function LoadingCard({ message, myKey }: Props) {
	return (
		<Card
			key={myKey}
			as={motion.div}
			{...animateOpacityProps}
			className="flex animate-pulse items-center justify-center rounded-xl px-3 py-5 font-light"
		>
			{message}
		</Card>
	);
}