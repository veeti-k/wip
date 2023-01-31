export const animateHeightProps = {
	initial: { opacity: 0, height: 0 },
	animate: { opacity: 1, height: "auto" },
	exit: { opacity: 0, height: 0 },
	transition: { duration: 0.2 },
} as const;

export const animateOpacityProps = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.2 },
};

export const animateOpacityPropsFast = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.08 },
};

export const animateListItemProps = {
	initial: { opacity: 0, height: 0 },
	animate: {
		opacity: 1,
		height: "auto",
		transition: {
			type: "spring",
			bounce: 0.3,
			opacity: { duration: 0.1 },
			duration: 0.4,
		},
	},
	exit: { opacity: 0, height: 0 },
	transition: {
		duration: 0.4,
		type: "spring",
		bounce: 0,
		opacity: { duration: 0.12 },
	},
};

export const errorCardStuff = {
	initial: { opacity: 0 },
	animate: {
		x: [0, 5, -5, 5, -5, 5, 0],
		opacity: 1,
		transition: { duration: 0.5, delay: 0.2 },
	},
	exit: { opacity: 0 },
	variant: "error" as const,
};
