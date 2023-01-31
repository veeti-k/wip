import { Modal, useModal } from "~components/Ui/Modal";
import { useHotkeys } from "~utils/use-hotkeys";

import { DevMenuAddManySessions } from "./AddManySessions";
import { DevMenuAddManySquats } from "./AddManySquats";
import { DevMenuAddSession } from "./AddSession";
import { DevMenuDeleteSessions } from "./DeleteSessions";

export function DevMenu() {
	const { closeModal, isModalOpen, openModal } = useModal();

	useHotkeys([["mod+j", openModal]]);

	return (
		<>
			<Modal isOpen={isModalOpen} closeModal={closeModal} title="Dev menu">
				<div className="flex flex-col gap-3 px-4 pb-4 pt-2">
					<DevMenuAddSession />

					<DevMenuAddManySessions />

					<DevMenuDeleteSessions />

					<DevMenuAddManySquats />
				</div>
			</Modal>
		</>
	);
}
