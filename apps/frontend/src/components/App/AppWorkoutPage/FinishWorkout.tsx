import { toast } from "react-hot-toast";

import type { RouterOutputs } from "@gym/api";

import { Button } from "~components/_ui/Button";
import { Modal, useModal } from "~components/_ui/Modal";
import { trpc } from "~trpcReact/trpcReact";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
};

export const FinishWorkout = ({ workout }: Props) => {
	const trpcCtx = trpc.useContext();
	const mutation = trpc.workout.finishWorkout.useMutation({
		onSuccess: (updatedWorkout) =>
			trpcCtx.workout.getOne.setData({ id: workout.id }, updatedWorkout),
	});
	const { closeModal, isModalOpen, openModal } = useModal();

	const onSubmit = () =>
		mutation
			.mutateAsync({ workoutId: workout.id })
			.then(() => closeModal())
			.catch((err) => toast.error(err?.message ?? "Unknown error"));

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
