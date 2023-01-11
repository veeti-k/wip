import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { Input } from "~components/Ui/Input";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";
import {
	UpdateExerciseFormType,
	updateExerciseFormSchema,
} from "~validation/session/updateExercise";

import { useUpdateExerciseMutation } from "./useUpdateExerciseMutation";

type Props = {
	exercise: NonNullable<RouterOutputs["session"]["getOne"]>["exercises"][number];
};

export function ExerciseNotes({ exercise }: Props) {
	const mutation = useUpdateExerciseMutation();

	const form = useForm<UpdateExerciseFormType>({
		resolver: zodResolver(updateExerciseFormSchema),
		defaultValues: { notes: exercise.notes },
	});

	function updateData() {
		return form.handleSubmit((values) =>
			mutation
				.mutateAsync({
					sessionId: exercise.sessionId,
					exerciseId: exercise.id,
					...values,
				})
				.catch(errorMsg(`Failed to update ${exercise.modelExercise.name} notes`))
		)();
	}

	const debouncedUpdateData = useCallback(debounce(updateData, 500), []);
	return <Input label="Notes" {...form.register("notes", { onChange: debouncedUpdateData })} />;
}
