import { motion } from "framer-motion";

import { errorCardStuff } from "~utils/animations";

import { Card } from "./Card";

type Props = {
	message: string;
};

export const ErrorCard = ({ message }: Props) => {
	return (
		<Card as={motion.div} {...errorCardStuff} className="rounded-xl">
			<div className="flex flex-col items-center justify-between px-3 py-5 font-light">
				{message}
			</div>
		</Card>
	);
};
