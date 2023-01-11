import { motion } from "framer-motion";

export function AnimatedSuccessIcon() {
	return (
		<motion.div
			className="flex items-center justify-center rounded-full bg-green-600 p-2"
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			transition={{
				delay: 0.2,
				duration: 0.4,
				type: "spring",
				stiffness: 200,
				bounce: 0.4,
				damping: 15,
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth="1.5"
				stroke="currentColor"
				className="h-10 w-10"
			>
				<motion.path
					initial={{ pathLength: 0 }}
					animate={{
						pathLength: 1,
						transition: { duration: 0.5, delay: 0.45 },
					}}
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M4.5 12.75l6 6 9-13.5"
				/>
			</svg>
		</motion.div>
	);
}
