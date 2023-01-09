import { AnimatePresence, motion } from "framer-motion";

import { Card } from "~components/_ui/Cards/Card";
import { ErrorCard } from "~components/_ui/Cards/ErrorCard";
import { LoadingCard } from "~components/_ui/Cards/LoadingCard";
import { trpc } from "~trpcReact/trpcReact";
import { animateOpacityProps } from "~utils/animations";
import { lazyWithPreload } from "~utils/lazyWithPreload";
import { useTitle } from "~utils/useTitle";

import { AppPageWrapper } from "../App";
import { Workout } from "./Workout";

const AppWorkoutPage = lazyWithPreload(() =>
	import("~components/App/AppWorkoutPage/AppWorkoutPage").then((mod) => ({
		default: mod.AppWorkoutPage,
	}))
);

export function AppWorkoutsPage() {
	useTitle("Workouts");
	const { data, isLoading, error } = trpc.workout.getAllPerMonth.useQuery();

	AppWorkoutPage.preload();

	return (
		<AppPageWrapper>
			<h1 className="mb-10 text-2xl font-light">Workouts</h1>

			<AnimatePresence initial={false}>
				{isLoading ? (
					<LoadingCard message="Getting workouts..." />
				) : error ? (
					<ErrorCard message="Error getting workouts" />
				) : Object.keys(data).length ? (
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
				) : (
					<Card
						as={motion.div}
						{...animateOpacityProps}
						className="px-3 py-5 text-center font-light"
					>
						No workouts
					</Card>
				)}
			</AnimatePresence>
		</AppPageWrapper>
	);
}
