import { ReactNode, useState } from "react";
import { toast } from "react-hot-toast";

import type { createExercise } from "@gym/validation";

import { Button } from "~components/_ui/Button";
import { Card } from "~components/_ui/Card";
import { ErrorCard } from "~components/_ui/ErrorCard";
import { Input } from "~components/_ui/Input";
import { Modal, useModal } from "~components/_ui/Modal";
import { trpc } from "~trpcReact/trpcReact";
import { animateOpacityProps } from "~utils/animations";

import { CreateExercise, CreateExerciseModal } from "./CreateExercise";
import { ExerciseCategory } from "./ExerciseCategory";

type Props = {
	workoutId: string;
};

export const AddExercise = ({ workoutId }: Props) => {
	// const [slides, setSlides] = useState<ReactNode[] | null>([<CreateExercise />, <CreateCategory />]);
	const { closeModal, isModalOpen, openModal } = useModal();

	const {
		data: exerciseCategories,
		isLoading,
		error,
	} = trpc.exercise.getModelExercises.useQuery();
	const addExerciseMutation = trpc.workout.addExercise.useMutation();
	const createModelExerciseMutation = trpc.exercise.createExercise.useMutation();

	const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");

	const noCategoriesAndQuery = !isLoading && !error && !exerciseCategories?.length && searchQuery;

	const addExercise = (modelExerciseId: string) => {
		addExerciseMutation
			.mutateAsync({ workoutId, modelExerciseId })
			.then(() => closeModal())
			.catch((err) => toast.error(`Error adding exercise ${err}`));
	};

	return (
		<>
			<Button onClick={openModal}>Add an exercise</Button>

			<Modal title="Add exercise" closeModal={closeModal} isOpen={isModalOpen}>
				<div className="flex flex-col p-4">
					<Input
						placeholder="Search"
						value={searchQuery}
						onChange={({ target: { value } }) => setSearchQuery(value)}
						// onKeyDown={(e) =>
						// 	e.code === "Enter" && noCategoriesAndQuery && // next slide (create exercise)
						// }
					/>

					<div className="mt-4 flex max-h-[300px] flex-col gap-2 overflow-auto">
						{isLoading ? (
							<Card
								variant={2}
								className="flex items-center justify-center p-3"
								{...animateOpacityProps}
							>
								Loading...
							</Card>
						) : error ? (
							<ErrorCard message="Error loading exercises" />
						) : noCategoriesAndQuery ? (
							<Card
								variant={2}
								className="flex items-center justify-center p-3"
								{...animateOpacityProps}
								// onClick={() => // next slide (create exercise)}
							>
								Create "{searchQuery}"
							</Card>
						) : exerciseCategories?.length ? (
							exerciseCategories?.map((category) => (
								<ExerciseCategory
									category={category}
									openCategoryId={openCategoryId}
									setOpenCategoryId={setOpenCategoryId}
								/>
							))
						) : (
							<Card
								variant={2}
								className="flex items-center justify-center px-3 py-5 font-light"
								{...animateOpacityProps}
							>
								No exercises
							</Card>
						)}
					</div>
				</div>
			</Modal>
		</>
	);
};

const exercises = {
	abs: [{ name: "Crunches" }, { name: "Leg raises" }],
	back: [
		{ name: "Assisted chin up" },
		{ name: "Assisted pull up" },
		{ name: "Barbell row" },
		{ name: "Cable row" },
		{ name: "Chin up" },
		{ name: "Deadlift" },
		{ name: "Dumbbell row" },
		{ name: "Hyperextensions" },
		{ name: "Pull up" },
		{ name: "Pulldowns" },
	],
	biceps: [
		{ name: "Barbell bicep curl" },
		{ name: "Concentration curl" },
		{ name: "Dumbbell bicep curl" },
		{ name: "Hammer curl" },
		{ name: "Hvc" },
	],
	cardio: [
		{ name: "Cycling" },
		{ name: "Eliptical trainer" },
		{ name: "Rowing machine" },
		{ name: "Running" },
		{ name: "Treadmill" },
		{ name: "Walking" },
	],
	chest: [
		{ name: "Bench press" },
		{ name: "Cable crossovers" },
		{ name: "Dumbbell flies" },
		{ name: "Dumbbell press" },
		{ name: "Incline bench press" },
		{ name: "Incline dumbbell press" },
	],
	legs: [
		{ name: "Calf raises" },
		{ name: "Front squat" },
		{ name: "Leg curls" },
		{ name: "Leg extensions" },
		{ name: "Leg press" },
		{ name: "Lunges" },
		{ name: "Seated calf raises" },
		{ name: "Squat" },
		{ name: "Straight leg deadlifts" },
	],
	shoulders: [
		{ name: "Dumbbell lateral raises" },
		{ name: "Military press" },
		{ name: "Shoulder dumbbell press" },
		{ name: "Upright rows" },
	],
	triceps: [
		{ name: "Assisted dips" },
		{ name: "Close grip bench press" },
		{ name: "Dips" },
		{ name: "Pushdowns" },
		{ name: "Triceps extensions" },
	],
};
