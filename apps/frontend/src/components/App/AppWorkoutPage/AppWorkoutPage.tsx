import { AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";

import { Button } from "~components/_ui/Button";
import { Card } from "~components/_ui/Card";
import { ErrorCard } from "~components/_ui/ErrorCard";
import { trpc } from "~trpcReact/trpcReact";
import { animateOpacityProps } from "~utils/animations";

import { AppPageWrapper } from "../App";
import { AddExercise } from "./AddExercise/AddExercise";
import { DeleteWorkout } from "./DeleteWorkout";
import { Exercise } from "./Exercise/Exercise";
import { FinishWorkout } from "./FinishWorkout";
import { TestParent } from "./Test/TestParent";
import { Times } from "./Times/Times";
import { WorkoutInputs } from "./WorkoutInputs";

export const AppWorkoutPage = () => {
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

	return (
		<AppPageWrapper>
			{isLoading ? (
				<Card
					className="flex items-center justify-center px-3 py-5 font-light"
					{...animateOpacityProps}
				>
					Loading...
				</Card>
			) : error ? (
				<ErrorCard message="Error getting workout" />
			) : workout ? (
				<>
					<div className="mb-4 flex flex-col gap-2">
						<h1 className="text-2xl">{workout.name}</h1>

						<Times workout={workout} />
					</div>

					<div className="flex flex-col gap-4">
						<WorkoutInputs workout={workout} />

						<Card className="flex flex-col gap-3 rounded-xl p-3">
							{inProgress && <FinishWorkout workout={workout} />}
							<Button>Save as a workout</Button>
							<DeleteWorkout workout={workout} />
						</Card>
					</div>

					<div className="mt-4 flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<h1 className="text-xl font-light">Exercises</h1>

							<AnimatePresence initial={false}>
								{hasExercises ? (
									workout?.exercises?.map((exercise) => (
										<Exercise key={exercise.id} exercise={exercise} />
									))
								) : (
									<Card
										className="flex items-center justify-center px-3 py-5 font-light"
										{...animateOpacityProps}
									>
										No exercises
									</Card>
								)}
							</AnimatePresence>

							<AddExercise workoutId={workout.id} />
							<TestParent />
						</div>
					</div>
				</>
			) : null}
		</AppPageWrapper>
	);
};
