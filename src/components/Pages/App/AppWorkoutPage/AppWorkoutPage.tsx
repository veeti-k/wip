import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef } from "react";

import { AppLayout } from "~components/Layouts/AppLayout/AppLayout";
import { Button } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { LoadingCard } from "~components/Ui/Cards/LoadingCard";
import { animateOpacityProps } from "~utils/animations";
import { trpc } from "~utils/trpc";

import { AddWorkoutExerciseModal } from "./AddWorkoutExercise/AddWorkoutExercise";
import { AddWorkoutExerciseProvider } from "./AddWorkoutExercise/AddWorkoutExerciseContext";
import { DeleteWorkout } from "./DeleteWorkout/DeleteWorkout";
import { WorkoutExercise } from "./WorkoutExercise/WorkoutExercise";

export default function AppWorkoutPage() {
	const lastExerciseRef = useRef<HTMLDivElement>(null);

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
				<div className="flex flex-col gap-4">
					<Card className="flex flex-col gap-2 p-3">
						<div className="flex justify-between gap-3">
							<h1 className="text-2xl">{workout.name}</h1>
						</div>
					</Card>

					<Card className="flex flex-col gap-3 rounded-xl p-3">
						<Button>Start a new session</Button>
						<DeleteWorkout workout={workout} />
					</Card>

					<div className="flex flex-col">
						<div className="flex flex-col">
							<h1 className="mb-2 text-xl font-light">Exercises</h1>

							<AnimatePresence initial={false} mode="wait">
								{hasExercises ? (
									workout.exercises.map((exercise, index) => (
										<WorkoutExercise
											key={exercise.id}
											workout={workout}
											exercise={exercise}
											isLast={index === workout.exercises.length - 1}
											exerciseRef={lastExerciseRef}
										/>
									))
								) : (
									<Card
										as={motion.div}
										key="no-exercises"
										className="mb-3 flex items-center justify-center px-3 py-5 font-light"
										{...animateOpacityProps}
									>
										No exercises
									</Card>
								)}
							</AnimatePresence>

							<AddWorkoutExerciseProvider
								workoutId={workout.id}
								lastExerciseRef={lastExerciseRef}
							>
								<AddWorkoutExerciseModal />
							</AddWorkoutExerciseProvider>
						</div>
					</div>
				</div>
			) : null}
		</AppLayout>
	);
}
