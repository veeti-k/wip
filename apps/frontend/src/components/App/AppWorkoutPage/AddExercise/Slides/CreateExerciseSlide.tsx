import { useEffect } from "react";
import { toast } from "react-hot-toast";

import type { createExercise } from "@gym/validation";

import { Button } from "~components/_ui/Button";
import { Input } from "~components/_ui/Input";
import { Select } from "~components/_ui/Select";
import { trpc } from "~trpcReact/trpcReact";

import { useAddExerciseContext } from "../AddExerciseContext";
import { useAddExerciseMutation } from "./AddExerciseSlide/useAddExerciseMutation";

export const CreateExerciseSlide = () => {
	const {
		addExerciseSearchQuery,
		createExerciseForm: form,
		setSlide,
		closeModal,
		workoutId,
	} = useAddExerciseContext();

	const {
		data: exerciseCategories,
		isLoading: exerciseCategoriesLoading,
		error: exerciseCategoriesError,
	} = trpc.exercise.getModelExercises.useQuery();

	const addExerciseMutation = useAddExerciseMutation({ workoutId });

	const mutation = trpc.exercise.createExercise.useMutation();

	const onSubmit = (values: createExercise.FormType) =>
		mutation
			.mutateAsync(values)
			.then((createdExercise) =>
				addExerciseMutation
					.mutateAsync({ workoutId, modelExerciseId: createdExercise.id })
					.then(() => {
						closeModal();
						form.reset();
					})
					.catch((err) =>
						toast.error(
							`Failed to add created exercise to workout: ${
								err?.message || "Unknown error"
							}`
						)
					)
			)
			.catch((err) =>
				toast.error(`Failed to create exercise: ${err?.message || "Unknown error"}`)
			);

	useEffect(() => {
		form.setValue("name", addExerciseSearchQuery);
	}, [addExerciseSearchQuery]);

	return (
		<form noValidate className="flex flex-col gap-3 p-4" onSubmit={form.handleSubmit(onSubmit)}>
			<Input
				label="Name"
				error={form.formState.errors.name?.message}
				{...form.register("name")}
			/>

			<div className="flex flex-col gap-2">
				<Select
					label="Category"
					required
					disabled={!!exerciseCategoriesLoading || !!exerciseCategoriesError}
					error={form.formState.errors.categoryId?.message}
					{...form.register("categoryId")}
				>
					<option value="">Select category</option>

					{exerciseCategoriesLoading ? (
						<option value="" disabled>
							Loading...
						</option>
					) : exerciseCategoriesError ? (
						<option value="" disabled>
							Error getting categories
						</option>
					) : (
						exerciseCategories?.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))
					)}
				</Select>

				<Button
					onClick={() => setSlide("createCategory")}
					disabled={!!exerciseCategoriesLoading || !!exerciseCategoriesError}
				>
					Create a category
				</Button>
			</div>

			<Select
				multiple
				label="Select fields"
				error={form.formState.errors.enabledFields?.message}
				required
				{...form.register("enabledFields")}
			>
				<option value="weight">Weight</option>
				<option value="reps">Reps</option>
				<option value="time">Time</option>
				<option value="distance">Distance</option>
				<option value="kcal">KCal</option>
			</Select>

			<div className="flex gap-3">
				<Button className="w-full" onClick={() => setSlide("addExercise")}>
					Cancel
				</Button>

				<Button className="w-full" intent="submit" type="submit">
					Add
				</Button>
			</div>
		</form>
	);
};
