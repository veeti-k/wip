import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import type { RouterOutputs } from "@gym/api";
import { editWorkout } from "@gym/validation";

import { Input } from "~components/_ui/Input";
import { errorMsg } from "~utils/errorMsg";
import { valueAsNumber } from "~utils/valueAsNumber";

import { useUpdateWorkoutMutation } from "./useUpdateWorkoutMutation";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
};

export function WorkoutInputs({ workout }: Props) {
	const mutation = useUpdateWorkoutMutation();

	const form = useForm<editWorkout.FormType>({
		resolver: zodResolver(editWorkout.form),
		defaultValues: {
			notes: workout.notes,
			bodyWeight: workout.bodyWeight,
		},
	});

	function updateData() {
		return form.handleSubmit((values) =>
			mutation
				.mutateAsync({
					workoutId: workout.id,
					...values,
				})
				.catch(errorMsg("Failed to update workout"))
		)();
	}

	const debouncedUpdateData = useCallback(debounce(updateData, 500), []);

	return (
		<div className="flex flex-col gap-3">
			<Input
				label="Notes"
				error={form.formState.errors.notes?.message}
				{...form.register("notes", {
					onChange: debouncedUpdateData,
				})}
			/>

			<Input
				label="(kg) Bodyweight"
				error={form.formState.errors.bodyWeight?.message}
				{...form.register("bodyWeight", {
					onChange: debouncedUpdateData,
					setValueAs: valueAsNumber,
				})}
			/>
		</div>
	);
}
