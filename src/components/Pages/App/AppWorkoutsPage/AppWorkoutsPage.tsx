import { AnimatePresence, motion } from "framer-motion";

import { AppLayout } from "~components/Layouts/AppLayout/AppLayout";
import { Card } from "~components/Ui/Cards/Card";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { LoadingCard } from "~components/Ui/Cards/LoadingCard";
import { animateOpacityProps } from "~utils/animations";
import { trpc } from "~utils/trpc";

import { Workout } from "./Workout";

export function AppWorkoutsPage() {
	const { data, isLoading, error } = trpc.workout.getAll.useQuery();

	return (
		<AppLayout title="Workouts">
			<h1 className="mb-5 text-2xl font-medium">Workouts</h1>

			<AnimatePresence initial={false}>
				{isLoading ? (
					<LoadingCard message="Getting workouts..." />
				) : error ? (
					<ErrorCard message="Error getting workouts" />
				) : data.length ? (
					<motion.div {...animateOpacityProps}>
						<AnimatePresence initial={false}>
							{data.map((workout) => (
								<Workout key={workout.id} workout={workout} />
							))}
						</AnimatePresence>
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
		</AppLayout>
	);
}
