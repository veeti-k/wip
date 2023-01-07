import { motion } from "framer-motion";

import { ButtonLink } from "~components/_ui/Button";
import { Card } from "~components/_ui/Cards/Card";
import { animateOpacityProps } from "~utils/animations";

export const NavBar = () => {
	return (
		<motion.nav
			{...animateOpacityProps}
			className="fixed bottom-0 flex w-full items-center justify-center p-3 backdrop:blur-sm sm:top-0 sm:bottom-[unset]"
		>
			<Card className="rounded-xl">
				<div className="grid h-[3.5rem] w-full max-w-[280px] grid-cols-3 grid-rows-1 items-center justify-between gap-2 overflow-hidden p-2 text-sm">
					<ButtonLink to="workouts">Workouts</ButtonLink>
					<ButtonLink to="">Home</ButtonLink>
					<ButtonLink to="settings">Settings</ButtonLink>
				</div>
			</Card>
		</motion.nav>
	);
};
