import { Button } from "~components/Ui/Button";
import { RemoveIcon } from "~components/Ui/Icons/RemoveIcon";
import { Modal, useModal } from "~components/Ui/Modal";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";

import { useDeleteExerciseMutation } from "./useDeleteExerciseMutation";

type Props = {
	session: NonNullable<RouterOutputs["session"]["getOne"]>;
	exercise: NonNullable<RouterOutputs["session"]["getOne"]>["exercises"][number];
};

export function DeleteExercise({ session, exercise }: Props) {
	const { closeModal, isModalOpen, openModal } = useModal();
	const mutation = useDeleteExerciseMutation();

	function onSubmit() {
		return mutation
			.mutateAsync({
				exerciseId: exercise._id.toString(),
				sessionId: session._id.toString(),
			})
			.then(() => closeModal())
			.catch(errorMsg("Failed to delete exercise"));
	}

	return (
		<>
			<Button className="!p-1" onClick={openModal}>
				<RemoveIcon className="text-red-400" />
			</Button>

			<Modal isOpen={isModalOpen} closeModal={closeModal} title="Delete exercise">
				<div className="flex flex-col gap-4 p-4">
					<p>
						Are you sure you want to delete {exercise.modelExercise.name} from this
						session?
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
}
