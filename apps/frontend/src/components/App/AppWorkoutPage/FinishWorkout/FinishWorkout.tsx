import type { RouterOutputs } from "@gym/api";

import { Button } from "~components/_ui/Button";
import { Modal, useModal } from "~components/_ui/Modal";
import { errorMsg } from "~utils/errorMsg";

import { useFinishWorkoutMutation } from "./useFinishWorkoutMutation";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
};

export const FinishWorkout = ({ workout }: Props) => {
	const mutation = useFinishWorkoutMutation();
	const { closeModal, isModalOpen, openModal } = useModal();

	const onSubmit = () =>
		mutation
			.mutateAsync({ workoutId: workout.id })
			.then(() => closeModal())
			.catch(errorMsg("Error finishing workout"));

	return (
		<>
			<Button onClick={openModal}>Finish workout</Button>

			<Modal isOpen={isModalOpen} closeModal={closeModal} title="Finish workout">
				<div className="flex flex-col gap-4 p-4">
					<p>Are you sure you want to finish {workout.name}?</p>

					<div className="flex gap-2">
						<Button className="w-full" onClick={closeModal}>
							Cancel
						</Button>

						<Button
							intent="submit"
							className="w-full"
							onClick={onSubmit}
							disabled={mutation.isLoading}
						>
							{mutation.isLoading ? "Finishing workout..." : "Finish workout"}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};
