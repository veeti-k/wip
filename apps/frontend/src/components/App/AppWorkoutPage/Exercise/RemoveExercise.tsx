import { toast } from "react-hot-toast";

import type { RouterOutputs } from "@gym/api";

import { Button } from "~components/_ui/Button";
import { RemoveIcon } from "~components/_ui/Icons/RemoveIcon";
import { Modal, useModal } from "~components/_ui/Modal";
import { trpc } from "~trpcReact/trpcReact";

type Props = {
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
};

export const RemoveExercise = ({ exercise }: Props) => {
	const trpcCtx = trpc.useContext();
	const { closeModal, isModalOpen, openModal } = useModal();
	const mutation = trpc.workout.removeExercise.useMutation({
		onSuccess: (updatedSession) => {
			trpcCtx.workout.getOne.setData({ id: exercise.workoutId }, updatedSession);
			trpcCtx.workout.getOne.invalidate({ id: exercise.workoutId });
		},
	});

	const onSubmit = () =>
		toast
			.promise(
				mutation.mutateAsync({
					exerciseId: exercise.id,
					workoutId: exercise.workoutId,
				}),
				{
					loading: "Removing exercise",
					success: "Exercise removed",
					error: "Failed to remove exercise",
				}
			)
			.then(() => closeModal())
			.catch((err) => toast.error(err?.message ?? "Unknown error"));

	return (
		<>
			<Button className="!p-1" onClick={openModal}>
				<RemoveIcon className="text-red-400" />
			</Button>

			<Modal isOpen={isModalOpen} closeModal={closeModal} title="Remove exercise">
				<div className="flex flex-col gap-4 p-4">
					<p>
						Are you sure you want to remove {exercise.modelExercise.name} from this
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
