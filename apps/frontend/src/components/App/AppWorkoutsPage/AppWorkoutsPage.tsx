import { AnimatePresence, motion } from "framer-motion";

import { Card } from "~components/_ui/Card";
import { trpc } from "~trpcReact/trpcReact";
import { animateOpacityProps, errorCardStuff } from "~utils/animations";

import { AppPageWrapper } from "../App";
import { Workout } from "./Workout";

export const AppWorkoutsPage = () => {
	const { data, isLoading, error } = trpc.workout.getAllPerMonth.useQuery();

	return (
		<AppPageWrapper>
			<h1 className="mb-10 text-2xl font-light">Workouts</h1>

			<AnimatePresence initial={false}>
				{isLoading ? (
					<Card
						as={motion.div}
						{...animateOpacityProps}
						className="flex items-center justify-center rounded-xl p-3"
					>
						Loading...
					</Card>
				) : error ? (
					<Card as={motion.div} {...errorCardStuff} className="rounded-xl">
						<div className="flex flex-col items-center justify-between gap-6 px-2 py-[4rem]">
							<h1 className="text-xl">Error getting workouts</h1>
						</div>
					</Card>
				) : (
					<motion.div {...animateOpacityProps}>
						{Object.entries(data).map(([month, workouts]) => (
							<div key={month}>
								<h2 className="mb-2 text-xl font-light">{month}</h2>

								<div className="flex flex-col justify-start gap-2">
									{workouts.map((workout) => (
										<Workout key={workout.id} workout={workout} />
									))}
								</div>
							</div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</AppPageWrapper>
	);
};
