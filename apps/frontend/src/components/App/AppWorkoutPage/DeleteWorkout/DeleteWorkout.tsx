import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import type { RouterOutputs } from "@gym/api";

import { Button } from "~components/_ui/Button";
import { Modal, useModal } from "~components/_ui/Modal";
import { errorMsg } from "~utils/errorMsg";

import { useDeleteWorkoutMutation } from "./useDeleteWorkoutMutation";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
};

export const DeleteWorkout = ({ workout }: Props) => {
	const navigate = useNavigate();
	const { closeModal, isModalOpen, openModal } = useModal();

	const mutation = useDeleteWorkoutMutation();

	const onSubmit = () =>
		mutation
			.mutateAsync({ workoutId: workout.id })
			.then(() => {
				closeModal();
				toast.success("Workout deleted");
				navigate("/app");
			})
			.catch(errorMsg("Failed to delete workout"));

	return (
		<>
			<Button onClick={openModal} intent="danger">
				Delete workout
			</Button>

			<Modal isOpen={isModalOpen} closeModal={closeModal} title="Delete workout">
				<div className="flex flex-col gap-3 px-4 pb-4 pt-2">
					<p>Are you sure you want to delete {workout.name}?</p>

					<div className="flex gap-3">
						<Button
							className="w-full"
							onClick={closeModal}
							disabled={mutation.isLoading}
						>
							Cancel
						</Button>

						<Button
							intent="danger"
							className="w-full"
							onClick={onSubmit}
							disabled={mutation.isLoading}
						>
							{mutation.isLoading ? "Deleting..." : "Yes, delete"}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};
