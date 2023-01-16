import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { Input } from "~components/Ui/Input";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";
import { valueAsNumber } from "~utils/valueAsNumber";
import { EditSessionFormType, editSessionInputSchema } from "~validation/session/editSession";

import { useUpdateSessionMutation } from "./useUpdateWorkoutMutation";

type Props = {
	session: NonNullable<RouterOutputs["session"]["getOne"]>;
};

export function SessionInputs({ session }: Props) {
	const mutation = useUpdateSessionMutation();

	const form = useForm<EditSessionFormType>({
		resolver: zodResolver(editSessionInputSchema),
		defaultValues: {
			notes: session.notes,
			bodyWeight: session.bodyWeight,
		},
	});

	function updateData() {
		return form.handleSubmit((values) =>
			mutation
				.mutateAsync({
					sessionId: session.id,
					...values,
				})
				.catch(errorMsg("Failed to update session"))
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
