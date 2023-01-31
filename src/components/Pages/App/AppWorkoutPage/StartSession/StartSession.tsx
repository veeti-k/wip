import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { Button } from "~components/Ui/Button";
import { Modal, useModal } from "~components/Ui/Modal";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";

import { useStartSessionMutation } from "./useStartSessionMutation";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
};

export function StartSession({ workout }: Props) {
	const mutation = useStartSessionMutation();
	const { closeModal, isModalOpen, openModal } = useModal();
	const router = useRouter();

	const onSubmit = () => {
		return mutation
			.mutateAsync({ workoutId: workout.id })
			.then((createdSession) => {
				closeModal();
				toast.success("Session started");
				router.push(`/app/sessions/${createdSession.id}`);
			})
			.catch(errorMsg("Failed to start the session"));
	};

	return (
		<>
			<Button onClick={openModal} disabled={mutation.isLoading}>
				{mutation.isLoading ? "Starting..." : "Start a new session"}
			</Button>

			<Modal isOpen={isModalOpen} closeModal={closeModal} title="Start a new session">
				<div className="flex flex-col gap-3 px-4 pb-4 pt-2">
					<p className="font-light">
						This will start a new session with exercises and sets from this saved
						workout.
					</p>

					<div className="flex justify-between gap-3">
						<Button className="w-full" onClick={closeModal}>
							Cancel
						</Button>

						<Button
							className="w-full"
							intent="submit"
							onClick={onSubmit}
							disabled={mutation.isLoading}
						>
							{mutation.isLoading ? "Starting..." : "Start the session"}
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}
