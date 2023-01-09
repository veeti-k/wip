import format from "date-fns/format";
import { useForm } from "react-hook-form";

import type { RouterOutputs } from "@gym/api";
import type { editWorkoutInfo } from "@gym/validation";

import { Button } from "~components/_ui/Button";
import { Input } from "~components/_ui/Input";
import { Modal, useModal } from "~components/_ui/Modal";
import { errorMsg } from "~utils/errorMsg";

import { FinishWorkout } from "../FinishWorkout/FinishWorkout";
import { useEditWorkoutInfoMutation } from "./useEditWorkoutInfoMutation";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
};

export function EditWorkoutInfo({ workout }: Props) {
	const { closeModal, isModalOpen, openModal } = useModal();

	const mutation = useEditWorkoutInfoMutation();

	const form = useForm<editWorkoutInfo.FormType>({
		defaultValues: {
			name: workout.name,
			createdAt: getHtmlDate(workout.createdAt),
			stoppedAt: workout.stoppedAt ? getHtmlDate(workout.stoppedAt) : null,
		},
	});

	function onSubmit(values: editWorkoutInfo.FormType) {
		mutation
			.mutateAsync({
				workoutId: workout.id,
				name: values.name,
				createdAt: new Date(values.createdAt),
				stoppedAt: values.stoppedAt ? new Date(values.stoppedAt) : null,
			})
			.then(() => closeModal())
			.catch(errorMsg("Failed to update workout"));
	}

	return (
		<>
			<Button className="!py-1 !px-2 text-sm" onClick={openModal}>
				Edit
			</Button>

			<Modal closeModal={closeModal} isOpen={isModalOpen} title="Edit workout">
				<form
					className="flex flex-col gap-4 p-4"
					onSubmit={form.handleSubmit(onSubmit)}
					noValidate
				>
					<div className="flex flex-col gap-3">
						<Input label="Name" {...form.register("name")} />

						<Input
							label="Started at"
							type="datetime-local"
							{...form.register("createdAt")}
						/>

						{workout.stoppedAt ? (
							<Input
								label="Finished at"
								type="datetime-local"
								{...form.register("stoppedAt")}
							/>
						) : (
							<FinishWorkout workout={workout} />
						)}
					</div>

					<div className="flex gap-3">
						<Button className="w-full" onClick={closeModal}>
							Cancel
						</Button>
						<Button className="w-full" intent="submit" disabled={mutation.isLoading}>
							{mutation.isLoading ? "Saving..." : "Save"}
						</Button>
					</div>
				</form>
			</Modal>
		</>
	);
}

function getHtmlDate(date: Date) {
	return `${format(date, "yyyy-MM-dd")}T${format(date, "HH:mm")}`;
}
