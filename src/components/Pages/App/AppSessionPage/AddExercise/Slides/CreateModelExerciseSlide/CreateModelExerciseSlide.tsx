import { useEffect, useState } from "react";

import { Button } from "~components/Ui/Button";
import { Input } from "~components/Ui/Input";
import { Select } from "~components/Ui/Select";
import { errorMsg } from "~utils/errorMsg";
import { trpc } from "~utils/trpc";
import type { CreateExerciseFormType } from "~validation/exercise/createExercise";

import { useAddExerciseContext } from "../../AddExerciseContext";
import { useAddExerciseMutation } from "../AddExerciseSlide/useAddExerciseMutation";
import { CategorySelect } from "./CategorySelect";

export function CreateModelExerciseSlide() {
	const {
		data: exerciseCategories,
		isLoading: exerciseCategoriesLoading,
		error: exerciseCategoriesError,
	} = trpc.modelExercise.getAll.useQuery();

	const [categoryState, setCategoryState] = useState<"create" | "select" | "loading" | "error">(
		exerciseCategoriesLoading
			? "loading"
			: exerciseCategoriesError
			? "error"
			: exerciseCategories?.length
			? "select"
			: "create"
	);

	const {
		addExerciseSearchQuery,
		createExerciseForm: form,
		setSlide,
		closeModal,
		sessionId,
	} = useAddExerciseContext();

	const addExerciseMutation = useAddExerciseMutation();

	const mutation = trpc.modelExercise.create.useMutation();

	function onSubmit(values: CreateExerciseFormType) {
		return mutation
			.mutateAsync(values)
			.then((createdExerciseId) =>
				addExerciseMutation
					.mutateAsync({ sessionId, modelExerciseId: createdExerciseId })
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
				{categoryState === "loading" ? (
					<Select multiple disabled label="Category">
						<option value="" disabled>
							Loading...
						</option>
					</Select>
				) : categoryState === "error" ? (
					<Select multiple disabled label="Category">
						<option value="" disabled>
							Error loading categories
						</option>
					</Select>
				) : categoryState === "create" && exerciseCategories ? (
					<CategorySelect exerciseCategories={exerciseCategories} />
				) : (
					<Input label="Category" {...form.register("categoryName")} />
				)}

				<Button
					disabled={categoryState !== "loading" && categoryState !== "error"}
					onClick={() =>
						setCategoryState((prev) => (prev === "create" ? "select" : "create"))
					}
				>
					{categoryState === "loading"
						? "Loading..."
						: categoryState === "error"
						? "Error loading categories"
						: categoryState === "create"
						? "Select category"
						: "Create category"}
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
