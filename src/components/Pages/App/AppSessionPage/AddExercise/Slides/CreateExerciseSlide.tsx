import { useEffect } from "react";

import { Button } from "~components/Ui/Button";
import { Input } from "~components/Ui/Input";
import { Select } from "~components/Ui/Select";
import { errorMsg } from "~utils/errorMsg";
import { trpc } from "~utils/trpc";
import type { CreateExerciseFormType } from "~validation/exercise/createExercise";

import { useAddExerciseContext } from "../AddExerciseContext";
import { useAddExerciseMutation } from "./AddExerciseSlide/useAddExerciseMutation";

export function CreateExerciseSlide() {
	const {
		addExerciseSearchQuery,
		createExerciseForm: form,
		setSlide,
		closeModal,
		sessionId,
	} = useAddExerciseContext();

	const {
		data: exerciseCategories,
		isLoading: exerciseCategoriesLoading,
		error: exerciseCategoriesError,
	} = trpc.exercise.getModelExercises.useQuery();

	const addExerciseMutation = useAddExerciseMutation({ sessionId });

	const mutation = trpc.exercise.createExercise.useMutation();

	function onSubmit(values: CreateExerciseFormType) {
		return mutation
			.mutateAsync(values)
			.then((createdExercise) =>
				addExerciseMutation
					.mutateAsync({ sessionId, modelExerciseId: createdExercise.id })
					.then(() => {
						closeModal();
						form.reset();
					})
					.catch(errorMsg("Failed to add created exercise to session"))
			)
			.catch(errorMsg("Failed to create exercise"));
	}

	useEffect(() => {
		form.setValue("name", addExerciseSearchQuery);
	}, [addExerciseSearchQuery, form]);

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
						exerciseCategories.map((category) => (
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

				<Button
					className="w-full"
					intent="submit"
					type="submit"
					disabled={mutation.isLoading}
				>
					{mutation.isLoading ? "Creating..." : "Create"}
				</Button>
			</div>
		</form>
	);
}
