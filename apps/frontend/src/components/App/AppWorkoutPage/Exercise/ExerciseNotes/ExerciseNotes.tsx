import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import type { RouterOutputs } from "@gym/api";
import { updateExercise } from "@gym/validation";

import { Input } from "~components/_ui/Input";

import { useUpdateExerciseMutation } from "./useUpdateExerciseMutation";

type Props = {
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
};

export const ExerciseNotes = ({ exercise }: Props) => {
	const mutation = useUpdateExerciseMutation();

	const form = useForm<updateExercise.FormType>({
		resolver: zodResolver(updateExercise.form),
		defaultValues: { notes: exercise.notes },
	});

	const updateData = () =>
		form.handleSubmit((values) =>
			mutation.mutateAsync({
				workoutId: exercise.workoutId,
				exerciseId: exercise.id,
				...values,
			})
		)();

	const debouncedUpdateData = useCallback(debounce(updateData, 500), []);
	return <Input label="Notes" {...form.register("notes", { onChange: debouncedUpdateData })} />;
};
