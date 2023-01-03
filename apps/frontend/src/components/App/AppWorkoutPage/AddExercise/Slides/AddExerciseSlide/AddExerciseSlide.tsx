import { useEffect, useState } from "react";

import { Card } from "~components/_ui/Card";
import { ErrorCard } from "~components/_ui/ErrorCard";
import { Input } from "~components/_ui/Input";
import { trpc } from "~trpcReact/trpcReact";
import { animateOpacityProps } from "~utils/animations";

import { useAddExerciseContext } from "../../AddExerciseContext";
import { ExerciseCategory } from "../../ExerciseCategory";
import { useAddExerciseMutation } from "./useAddExerciseMutation";

export const AddExerciseSlide = () => {
	const { addExerciseSearchQuery, setAddExerciseSearchQuery, setSlide, workoutId, closeModal } =
		useAddExerciseContext();
	const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
	const {
		data: exerciseCategories,
		isLoading,
		error,
	} = trpc.exercise.getModelExercises.useQuery();

	const mutation = useAddExerciseMutation({ workoutId });

	const queryAndCategories =
		!isLoading && !error && exerciseCategories?.length && addExerciseSearchQuery;

	const innerCategories = queryAndCategories
		? exerciseCategories?.filter(
				(category) =>
					category.name.toLowerCase().includes(addExerciseSearchQuery.toLowerCase()) ||
					category.modelExercises.some((me) =>
						me.name.toLowerCase().includes(addExerciseSearchQuery.toLowerCase())
					)
		  )
		: exerciseCategories;

	const noCategoriesAndQuery =
		!isLoading && !error && !innerCategories?.length && addExerciseSearchQuery;

	useEffect(() => setAddExerciseSearchQuery(""), []);

	return (
		<div className="flex flex-col p-4">
			<Input
				placeholder="Search"
				value={addExerciseSearchQuery}
				onChange={({ target: { value } }) => setAddExerciseSearchQuery(value)}
				onKeyDown={(e) =>
					e.code === "Enter" && noCategoriesAndQuery && setSlide("createExercise")
				}
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
						onClick={() => setSlide("createExercise")}
					>
						Create "{addExerciseSearchQuery}"
					</Card>
				) : innerCategories?.length ? (
					innerCategories?.map((category) => (
						<ExerciseCategory
							category={category}
							allOpen={!!queryAndCategories}
							openCategoryId={openCategoryId}
							setOpenCategoryId={setOpenCategoryId}
							onClick={(modelExerciseId) =>
								mutation
									.mutateAsync({ modelExerciseId, workoutId })
									.then(() => closeModal())
							}
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
	);
};
