import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Card } from "~components/Ui/Cards/Card";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { LoadingCard } from "~components/Ui/Cards/LoadingCard";
import { Input } from "~components/Ui/Input";
import { animateOpacityProps } from "~utils/animations";
import { errorMsg } from "~utils/errorMsg";
import { RouterOutputs, trpc } from "~utils/trpc";

import { useAddWorkoutExerciseContext } from "../../AddWorkoutExerciseContext";
import { ExerciseCategory } from "../../ExerciseCategory";
import { useAddWorkoutExerciseMutation } from "./useAddWorkoutExerciseMutation";

export function AddWorkoutExerciseSlide() {
	const {
		addWorkoutExerciseSearchQuery,
		setAddWorkoutExerciseSearchQuery,
		setSlide,
		workoutId,
		closeModal,
		scrollToLastExercise,
	} = useAddWorkoutExerciseContext();
	const [openCategoryName, setOpenCategoryName] = useState<string | null>(null);
	const { data: exerciseCategories, isLoading, error } = trpc.modelExercise.getAll.useQuery();

	const mutation = useAddWorkoutExerciseMutation();

	const queryAndCategories =
		!isLoading && !error && exerciseCategories.length && addWorkoutExerciseSearchQuery;

	const innerCategories = queryAndCategories
		? categorySearch({ categories: exerciseCategories, query: addWorkoutExerciseSearchQuery })
		: exerciseCategories;

	const noCategoriesAndQuery =
		!isLoading && !error && !innerCategories?.length && addWorkoutExerciseSearchQuery;

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => setAddWorkoutExerciseSearchQuery(""), []);

	const onAddExercise = (modelExerciseId: string) => {
		return mutation
			.mutateAsync({ modelExerciseId, workoutId })
			.then(() => {
				closeModal();
				scrollToLastExercise();
			})
			.catch(errorMsg("Failed to adding exercise to session"));
	};

	return (
		<div className="flex flex-col p-4">
			<Input
				placeholder="Search"
				value={addWorkoutExerciseSearchQuery}
				onChange={({ target: { value } }) => setAddWorkoutExerciseSearchQuery(value)}
				onKeyDown={(e) =>
					e.code === "Enter" && noCategoriesAndQuery && setSlide("createExercise")
				}
			/>

			<div className="mt-4 flex max-h-[300px] flex-col gap-2 overflow-auto" tabIndex={-1}>
				{isLoading ? (
					<LoadingCard message="Getting exercises..." />
				) : error ? (
					<ErrorCard message="Error getting exercises" />
				) : noCategoriesAndQuery ? (
					<Card
						as={motion.div}
						variant={2}
						className="flex items-center justify-center p-3"
						{...animateOpacityProps}
						onClick={() => setSlide("createExercise")}
					>
						{`Create "${addWorkoutExerciseSearchQuery}"`}
					</Card>
				) : innerCategories?.length ? (
					innerCategories.map((category) => (
						<ExerciseCategory
							key={category.categoryName}
							category={category}
							allOpen={!!queryAndCategories}
							openCategoryName={openCategoryName}
							setOpenCategoryName={setOpenCategoryName}
							onClick={onAddExercise}
						/>
					))
				) : (
					<Card
						as={motion.div}
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
}

function categorySearch({
	categories,
	query,
}: {
	categories?: RouterOutputs["modelExercise"]["getAll"];
	query: string;
}) {
	const parsedQuery = query.trim().toLocaleLowerCase();

	return categories
		?.filter(
			(category) =>
				category.categoryName.toLowerCase().includes(parsedQuery) ||
				category.modelExercises.some((me) => me.name.toLowerCase().includes(parsedQuery))
		)
		.map((c) => ({
			...c,
			// sort modelExercises by if they include the query and then alphabetically
			modelExercises: c.modelExercises.sort((a, b) => {
				const aIncludes = a.name.toLowerCase().includes(parsedQuery);
				const bIncludes = b.name.toLowerCase().includes(parsedQuery);
				return aIncludes === bIncludes ? a.name.localeCompare(b.name) : aIncludes ? -1 : 1;
			}),
		}))
		.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
}
