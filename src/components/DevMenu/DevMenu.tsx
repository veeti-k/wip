import { Modal, useModal } from "~components/Ui/Modal";
import { useHotkeys } from "~utils/use-hotkeys";

import { DevMenuAddSession } from "./AddSession";

export function DevMenu() {
	const { closeModal, isModalOpen, openModal } = useModal();

	useHotkeys([["mod+alt+h", openModal]]);

	return (
		<>
			<Modal isOpen={isModalOpen} closeModal={closeModal} title="Dev menu">
				<div className="flex flex-col gap-3 px-4 pb-4 pt-2">
					<DevMenuAddSession />
				</div>
			</Modal>
		</>
	);
}
