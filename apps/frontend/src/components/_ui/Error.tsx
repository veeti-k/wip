import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

import { classNames } from "~utils/classNames";

import { WarningIcon } from "./Icons/WarningIcon";

type Props = {
	message?: ReactNode;
	htmlFor?: string;
	className?: string;
};

export function Error({ message, htmlFor, className }: Props) {
	const hasError = !!message;

	return (
		<AnimatePresence>
			{hasError && (
				<motion.span
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto", transition: { duration: 0.15 } }}
					exit={{ opacity: 0, height: 0, transition: { duration: 0.15 } }}
					className={classNames(className, "text-[15px] font-medium text-red-400")}
				>
					<label htmlFor={htmlFor} className="flex items-center gap-1 pt-2 font-light">
						<WarningIcon /> {message}
					</label>
				</motion.span>
			)}
		</AnimatePresence>
	);
}
