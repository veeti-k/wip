import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";

import { Button } from "~components/_ui/Button";
import { Card } from "~components/_ui/Cards/Card";
import { ErrorCard } from "~components/_ui/Cards/ErrorCard";
import { LoadingCard } from "~components/_ui/Cards/LoadingCard";
import { trpc } from "~trpcReact/trpcReact";
import { animateOpacityProps } from "~utils/animations";
import { useTitle } from "~utils/useTitle";

import { AppPageWrapper } from "../App";
import { AddExerciseModal } from "./AddExercise/AddExercise";
import { AddExerciseProvider } from "./AddExercise/AddExerciseContext";
import { DeleteWorkout } from "./DeleteWorkout/DeleteWorkout";
import { EditWorkoutInfo } from "./EditWorkoutInfo/EditWorkoutInfo";
import { Exercise } from "./Exercise/Exercise";
import { FinishWorkout } from "./FinishWorkout/FinishWorkout";
import { Times } from "./Times/Times";
import { WorkoutInputs } from "./WorkoutInputs/WorkoutInputs";

export function AppWorkoutPage() {
	const { workoutId } = useParams();

	const {
		data: workout,
		isLoading,
		error,
	} = trpc.workout.getOne.useQuery({
		id: workoutId ?? "",
	});

	const inProgress = !!!workout?.stoppedAt;
	const hasExercises = !!workout?.exercises.length;

	useTitle(workout?.name ?? "Workout");

	return (
		<AppPageWrapper>
			{isLoading ? (
				<LoadingCard message="Getting workout info..." />
			) : error ? (
				<ErrorCard message="Error getting workout" />
			) : workout ? (
				<>
					<Card className="mb-4 flex flex-col gap-2 p-3">
						<div className="flex justify-between gap-3">
							<h1 className="text-2xl">{workout.name}</h1>

							<EditWorkoutInfo workout={workout} />
						</div>

						<Times workout={workout} />
						<WorkoutInputs workout={workout} />
					</Card>

					<div className="flex flex-col gap-4">
						<Card className="flex flex-col gap-3 rounded-xl p-3">
							{inProgress && <FinishWorkout workout={workout} />}
							<Button>Save as a workout</Button>
							<DeleteWorkout workout={workout} />
						</Card>
					</div>

					<div className="mt-4 flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<h1 className="text-xl font-light">Exercises</h1>

							<AnimatePresence initial={false} mode="popLayout">
								{hasExercises ? (
									workout.exercises.map((exercise) => (
										<Exercise key={exercise.id} exercise={exercise} />
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

							<AddExerciseProvider workoutId={workout.id}>
								<AddExerciseModal />
							</AddExerciseProvider>
						</div>
					</div>
				</>
			) : null}
		</AppPageWrapper>
	);
}
