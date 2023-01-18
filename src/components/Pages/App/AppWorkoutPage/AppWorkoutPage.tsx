import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

import { AppLayout } from "~components/Layouts/AppLayout/AppLayout";
import { Button } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { LoadingCard } from "~components/Ui/Cards/LoadingCard";
import { animateOpacityProps } from "~utils/animations";
import { trpc } from "~utils/trpc";

import { DeleteWorkout } from "./WorkoutExercise/DeleteWorkout/DeleteWorkout";
import { WorkoutExercise } from "./WorkoutExercise/WorkoutExercise";

export default function AppWorkoutPage() {
	const router = useRouter();
	const workoutId = router.query["workoutId"];

	const {
		data: workout,
		isLoading,
		error,
	} = trpc.workout.getOne.useQuery({
		workoutId: workoutId && typeof workoutId === "string" ? workoutId : "",
	});

	const hasExercises = !!workout?.exercises.length;

	return (
		<AppLayout title="Workout">
			<h1 className="mb-5 text-2xl font-medium">Workout</h1>

			{isLoading ? (
				<LoadingCard message="Getting workout info..." />
			) : error ? (
				<ErrorCard message="Error getting workout" />
			) : workout ? (
				<>
					<Card className="mb-4 flex flex-col gap-2 p-3">
						<div className="flex justify-between gap-3">
							<h1 className="text-2xl">{workout.name}</h1>
						</div>
					</Card>

					<Card className="flex flex-col gap-3 rounded-xl p-3">
						<Button>Start a new session</Button>
						<DeleteWorkout workout={workout} />
					</Card>

					<div className="mt-4 flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<h1 className="text-xl font-light">Exercises</h1>

							<div className="space-y-2">
								<AnimatePresence initial={false} mode="popLayout">
									{hasExercises ? (
										workout.exercises.map((exercise) => (
											<WorkoutExercise
												key={exercise.id}
												workout={workout}
												exercise={exercise}
											/>
										))
									) : (
										<Card
											as={motion.div}
											key="no-exercises"
											className="flex items-center justify-center px-3 py-5 font-light"
											{...animateOpacityProps}
										>
											No exercises
										</Card>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>
				</>
			) : null}
		</AppLayout>
	);
}
