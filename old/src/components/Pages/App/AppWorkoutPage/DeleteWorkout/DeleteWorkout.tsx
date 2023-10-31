import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { Button } from "~components/Ui/Button";
import { Modal, useModal } from "~components/Ui/Modal";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";

import { useDeleteWorkoutMutation } from "./useDeleteWorkoutMutation";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
};

export function DeleteWorkout({ workout }: Props) {
	const router = useRouter();
	const { closeModal, isModalOpen, openModal } = useModal();

	const mutation = useDeleteWorkoutMutation();

	function onSubmit() {
		return mutation
			.mutateAsync({ workoutId: workout.id })
			.then(() => {
				closeModal();
				toast.success("Workout deleted");
				router.push("/app/workouts");
			})
			.catch(errorMsg("Failed to delete workout"));
	}

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
}
