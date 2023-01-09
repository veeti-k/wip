import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { RouterOutputs } from "@gym/api";

import { Card } from "~components/_ui/Cards/Card";
import { ErrorCard } from "~components/_ui/Cards/ErrorCard";
import { LoadingCard } from "~components/_ui/Cards/LoadingCard";
import { Input } from "~components/_ui/Input";
import { trpc } from "~trpcReact/trpcReact";
import { animateOpacityProps } from "~utils/animations";
import { errorMsg } from "~utils/errorMsg";

import { useAddExerciseContext } from "../../AddExerciseContext";
import { ExerciseCategory } from "../../ExerciseCategory";
import { useAddExerciseMutation } from "./useAddExerciseMutation";

export function AddExerciseSlide() {
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
		!isLoading && !error && exerciseCategories.length && addExerciseSearchQuery;

	const innerCategories = queryAndCategories
		? categorySearch({ categories: exerciseCategories, query: addExerciseSearchQuery })
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
						Create "{addExerciseSearchQuery}"
					</Card>
				) : innerCategories?.length ? (
					innerCategories.map((category) => (
						<ExerciseCategory
							key={category.id}
							category={category}
							allOpen={!!queryAndCategories}
							openCategoryId={openCategoryId}
							setOpenCategoryId={setOpenCategoryId}
							onClick={(modelExerciseId) =>
								mutation
									.mutateAsync({ modelExerciseId, workoutId })
									.then(() => closeModal())
									.catch(errorMsg("Failed to adding exercise to workout"))
							}
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
	categories?: RouterOutputs["exercise"]["getModelExercises"];
	query: string;
}) {
	const parsedQuery = query.trim().toLocaleLowerCase();

	return categories
		?.filter(
			(category) =>
				category.name.toLowerCase().includes(parsedQuery) ||
				category.modelExercises.some((me) => me.name.toLowerCase().includes(parsedQuery))
		)
		.map((c) => ({
			...c,
			modelExercises: c.modelExercises.sort((a, b) => a.name.localeCompare(b.name)),
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}
