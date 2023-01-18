import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

import { Button } from "~components/Ui/Button";
import { Input } from "~components/Ui/Input";
import { Modal, useModal } from "~components/Ui/Modal";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";
import type { EditWorkoutInfoFormType } from "~validation/workout/editWorkoutInfo";

import { useEditWorkoutInfo } from "./useEditWorkoutInfo";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
};

export default function EditWorkoutInfo({ workout }: Props) {
	const { closeModal, isModalOpen, openModal } = useModal();

	const mutation = useEditWorkoutInfo();

	const form = useForm<EditWorkoutInfoFormType>({
		defaultValues: { name: workout.name },
	});

	function onSubmit(values: EditWorkoutInfoFormType) {
		return mutation
			.mutateAsync({
				workoutId: workout.id,
				name: values.name,
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
					className="flex flex-col gap-3 p-4"
					onSubmit={form.handleSubmit(onSubmit)}
					noValidate
				>
					<Input label="Name" {...form.register("name")} />

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
