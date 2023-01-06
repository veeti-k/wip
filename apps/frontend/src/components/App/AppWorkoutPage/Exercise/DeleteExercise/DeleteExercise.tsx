import type { RouterOutputs } from "@gym/api";

import { Button } from "~components/_ui/Button";
import { RemoveIcon } from "~components/_ui/Icons/RemoveIcon";
import { Modal, useModal } from "~components/_ui/Modal";
import { errorMsg } from "~utils/errorMsg";

import { useDeleteExerciseMutation } from "./useDeleteExerciseMutation";

type Props = {
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
};

export const DeleteExercise = ({ exercise }: Props) => {
	const { closeModal, isModalOpen, openModal } = useModal();
	const mutation = useDeleteExerciseMutation();

	const onSubmit = () =>
		mutation
			.mutateAsync({
				exerciseId: exercise.id,
				workoutId: exercise.workoutId,
			})
			.then(() => closeModal())
			.catch(errorMsg("Failed to delete exercise"));

	return (
		<>
			<Button className="!p-1" onClick={openModal}>
				<RemoveIcon className="text-red-400" />
			</Button>

			<Modal isOpen={isModalOpen} closeModal={closeModal} title="Delete exercise">
				<div className="flex flex-col gap-4 p-4">
					<p>
						Are you sure you want to delete {exercise.modelExercise.name} from this
						workout?
					</p>

					<div className="flex gap-2">
						<Button className="w-full" onClick={closeModal}>
							Cancel
						</Button>

						<Button
							intent="danger"
							className="w-full"
							onClick={onSubmit}
							disabled={mutation.isLoading}
						>
							{mutation.isLoading ? "Removing..." : "Remove"}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};
