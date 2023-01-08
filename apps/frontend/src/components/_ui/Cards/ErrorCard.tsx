import { motion } from "framer-motion";

import { errorCardStuff } from "~utils/animations";

import { Card } from "./Card";

type Props = {
	message: string;
};

export function ErrorCard({ message }: Props) {
	return (
		<Card
			as={motion.div}
			{...errorCardStuff}
			className="flex items-center justify-center rounded-xl px-3 py-5 font-light"
		>
			{message}
		</Card>
	);
}
