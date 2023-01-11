import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { Button } from "~components/Ui/Button";
import { Modal, useModal } from "~components/Ui/Modal";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";

import { useDeleteSessionMutation } from "./useDeleteSessionMutation";

type Props = {
	session: NonNullable<RouterOutputs["session"]["getOne"]>;
};

export function DeleteSession({ session }: Props) {
	const router = useRouter();
	const { closeModal, isModalOpen, openModal } = useModal();

	const mutation = useDeleteSessionMutation();

	function onSubmit() {
		return mutation
			.mutateAsync({ sessionId: session.id })
			.then(() => {
				closeModal();
				toast.success("Session deleted");
				router.push("/app");
			})
			.catch(errorMsg("Failed to delete session"));
	}

	return (
		<>
			<Button onClick={openModal} intent="danger">
				Delete session
			</Button>

			<Modal isOpen={isModalOpen} closeModal={closeModal} title="Delete session">
				<div className="flex flex-col gap-3 px-4 pb-4 pt-2">
					<p>Are you sure you want to delete {session.name}?</p>

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
