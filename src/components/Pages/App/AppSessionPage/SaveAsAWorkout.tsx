import { Button } from "~components/Ui/Button";
import { Modal, useModal } from "~components/Ui/Modal";
import { RouterOutputs, trpc } from "~utils/trpc";

type Props = {
	session: NonNullable<RouterOutputs["session"]["getOne"]>;
};

export function SaveAsAWorkout({ session }: Props) {
	const { closeModal, isModalOpen, openModal } = useModal();

	const mutation = trpc.workout.create.useMutation();

	async function handleSave() {
		return mutation.mutateAsync({
			sessionId: session.id,
			share: false,
		});
	}

	return (
		<>
			<Button onClick={openModal}>Save as a workout</Button>

			<Modal title="Save as a workout" isOpen={isModalOpen} closeModal={closeModal}>
				<div className="flex flex-col gap-3 px-4 pb-4 pt-3">
					<p>
						Saving a session as a workout will save the exercises and their{" "}
						<b>sets without weights</b>.
					</p>

					<div className="flex gap-3">
						<Button onClick={closeModal} className="w-full">
							Cancel
						</Button>
						<Button className="w-full" intent="submit" onClick={handleSave}>
							{mutation.isLoading ? "Saving..." : "Save"}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}
