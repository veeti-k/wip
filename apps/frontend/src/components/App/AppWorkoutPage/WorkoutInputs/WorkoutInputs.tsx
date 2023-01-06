import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import type { RouterOutputs } from "@gym/api";
import { updateWorkout } from "@gym/validation";

import { Input } from "~components/_ui/Input";

import { useUpdateWorkoutMutation } from "./useUpdateWorkoutMutation";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
};

export const WorkoutInputs = ({ workout }: Props) => {
	const mutation = useUpdateWorkoutMutation();

	const form = useForm<updateWorkout.FormType>({
		resolver: zodResolver(updateWorkout.form),
		defaultValues: {
			notes: workout.notes,
			bodyWeight: workout.bodyWeight,
		},
	});

	const updateData = () =>
		form.handleSubmit((values) =>
			mutation.mutateAsync({
				workoutId: workout.id,
				...values,
			})
		)();

	const debouncedUpdateData = useCallback(debounce(updateData, 500), []);

	return (
		<div className="flex flex-col gap-3">
			<Input
				label="Notes"
				error={form.formState.errors.notes?.message}
				{...form.register("notes", { onChange: debouncedUpdateData })}
			/>

			<Input
				label="(kg) Bodyweight"
				error={form.formState.errors.bodyWeight?.message}
				{...form.register("bodyWeight", {
					onChange: debouncedUpdateData,
					valueAsNumber: true,
				})}
			/>
		</div>
	);
};
