import { Button } from "~components/Ui/Button";
import { RemoveIcon } from "~components/Ui/Icons/RemoveIcon";
import { Modal, useModal } from "~components/Ui/Modal";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";

import { useDeleteWorkoutExerciseMutation } from "./useDeleteWorkoutExerciseMutation";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
};

export function DeleteExercise({ workout, exercise }: Props) {
	const { closeModal, isModalOpen, openModal } = useModal();
	const mutation = useDeleteWorkoutExerciseMutation();

	function onSubmit() {
		return mutation
			.mutateAsync({
				exerciseId: exercise.id,
				workoutId: workout.id,
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
}
