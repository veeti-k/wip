import { motion } from "framer-motion";

import { ChevronDown } from "./Icons/ChevronDown";

type Props = {
	open: boolean;
	openByDefault?: boolean;
	onClick?: () => void;
};

export const AnimatedChevron = ({ open, openByDefault, onClick }: Props) => (
	<motion.div
		key="chevron"
		aria-hidden="true"
		initial={{ transform: openByDefault ? "rotate(180deg)" : "rotate(0deg)" }}
		animate={open ? { transform: "rotate(180deg)" } : { transform: "rotate(0deg)" }}
		transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
		onClick={() => onClick && onClick()}
	>
		<ChevronDown />
	</motion.div>
);
