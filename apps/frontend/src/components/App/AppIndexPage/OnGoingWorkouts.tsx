import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Card } from "~components/_ui/Cards/Card";
import { ErrorCard } from "~components/_ui/Cards/ErrorCard";
import { LoadingCard } from "~components/_ui/Cards/LoadingCard";
import { trpc } from "~trpcReact/trpcReact";
import { animateOpacityProps } from "~utils/animations";
import { lazyWithPreload } from "~utils/lazyWithPreload";

import { Duration } from "../AppWorkoutPage/Times/Duration";

const AppWorkoutPage = lazyWithPreload(() =>
	import("~components/App/AppWorkoutPage/AppWorkoutPage").then((mod) => ({
		default: mod.AppWorkoutPage,
	}))
);

export function OnGoingWorkouts() {
	const { data, isLoading, error } = trpc.workout.getOnGoing.useQuery();

	const trpcCtx = trpc.useContext();
	data?.forEach((s) => trpcCtx.workout.getOne.prefetch({ id: s.id }));

	if (isLoading) {
		return <LoadingCard message="Getting on going workouts..." />;
	}
	if (error) {
		return <ErrorCard message="Error getting on going workouts" />;
	}

	data.length && AppWorkoutPage.preload();

	return (
		<AnimatePresence initial={false}>
			{data.length ? (
				<motion.div {...animateOpacityProps} className="flex flex-col gap-2">
					<h2 className="text-lg font-light">On going workouts</h2>

					{data.map((workout) => (
						<Card
							as={Link}
							key={workout.id}
							to={`workouts/${workout.id}`}
							className="rounded-md"
						>
							<div className="flex flex-col gap-2 p-2">
								<div className="flex justify-between gap-2 font-light">
									<h3>{workout.name}</h3>

									<h4 className="transition-[color] duration-200">
										<Duration workout={workout} />
									</h4>
								</div>
							</div>
						</Card>
					))}
				</motion.div>
			) : (
				<Card
					as={motion.div}
					{...animateOpacityProps}
					className="px-4 py-5 text-center font-light"
				>
					No on going workouts
				</Card>
			)}
		</AnimatePresence>
	);
}
