import { Button } from "~components/Ui/Button";
import { Modal, useModal } from "~components/Ui/Modal";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";

import { useFinishSessionMutation } from "./useFinishWorkoutMutation";

type Props = {
	session: NonNullable<RouterOutputs["session"]["getOne"]>;
};

export function FinishSession({ session }: Props) {
	const mutation = useFinishSessionMutation();
	const { closeModal, isModalOpen, openModal } = useModal();

	function onSubmit() {
		return mutation
			.mutateAsync({ sessionId: session._id.toString() })
			.then(() => closeModal())
			.catch(errorMsg("Failed to finish session"));
	}

	return (
		<>
			<Button onClick={openModal}>Finish session</Button>

			<Modal isOpen={isModalOpen} closeModal={closeModal} title="Finish session">
				<div className="flex flex-col gap-3 px-4 pb-4 pt-2">
					<p>Are you sure you want to finish {session.name}?</p>

					<div className="flex gap-3">
						<Button className="w-full" onClick={closeModal}>
							Cancel
						</Button>

						<Button
							intent="submit"
							className="w-full"
							onClick={onSubmit}
							disabled={mutation.isLoading}
						>
							{mutation.isLoading ? "Finishing..." : "Yes, finish"}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}
