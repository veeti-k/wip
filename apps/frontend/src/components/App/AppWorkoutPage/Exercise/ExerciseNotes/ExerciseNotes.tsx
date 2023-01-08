import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import type { RouterOutputs } from "@gym/api";
import { updateExercise } from "@gym/validation";

import { Input } from "~components/_ui/Input";
import { errorMsg } from "~utils/errorMsg";

import { useUpdateExerciseMutation } from "./useUpdateExerciseMutation";

type Props = {
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
};

export function ExerciseNotes({ exercise }: Props) {
	const mutation = useUpdateExerciseMutation();

	const form = useForm<updateExercise.FormType>({
		resolver: zodResolver(updateExercise.form),
		defaultValues: { notes: exercise.notes },
	});

	function updateData() {
		return form.handleSubmit((values) =>
			mutation
				.mutateAsync({
					workoutId: exercise.workoutId,
					exerciseId: exercise.id,
					...values,
				})
				.catch(errorMsg(`Failed to update ${exercise.modelExercise.name} notes`))
		)();
	}

	const debouncedUpdateData = useCallback(debounce(updateData, 500), []);
	return <Input label="Notes" {...form.register("notes", { onChange: debouncedUpdateData })} />;
}
