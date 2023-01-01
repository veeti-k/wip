import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import type { RouterOutputs } from "@gym/api";

import { Button } from "~components/_ui/Button";
import { Modal, useModal } from "~components/_ui/Modal";
import { trpc } from "~trpcReact/trpcReact";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
};

export const DeleteWorkout = ({ workout }: Props) => {
	const navigate = useNavigate();
	const { closeModal, isModalOpen, openModal } = useModal();

	const trpcCtx = trpc.useContext();

	const mutation = trpc.workout.deleteWorkout.useMutation({
		onSuccess: () => trpcCtx.workout.getOne.reset({ id: workout.id }),
	});

	const onSubmit = () =>
		mutation
			.mutateAsync({ workoutId: workout.id })
			.then(() => {
				closeModal();
				toast.success("Session deleted");
				navigate("/app");
			})
			.catch((err) => toast.error(err?.message ?? "Unknown error"));

	return (
		<>
			<Button onClick={openModal} intent="danger">
				Delete workout
			</Button>

			<Modal isOpen={isModalOpen} closeModal={closeModal} title="Delete workout">
				<div className="flex flex-col gap-4 p-4">
					<p>Are you sure you want to delete {workout.name}?</p>

					<div className="flex gap-2">
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
							{mutation.isLoading ? "Deleting workout..." : "Delete workout"}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};
