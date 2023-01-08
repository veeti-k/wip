import { Button } from "~components/_ui/Button";
import { Modal } from "~components/_ui/Modal";

import { useAddExerciseContext } from "./AddExerciseContext";

export function AddExerciseModal() {
	const { getOpenSlide, setSlide, closeModal, isModalOpen, openModal } = useAddExerciseContext();

	const slide = getOpenSlide();

	if (!slide) {
		return null;
	}

	return (
		<>
			<Button
				onClick={() => {
					setSlide("addExercise");
					openModal();
				}}
			>
				Add exercise
			</Button>

			<Modal closeModal={closeModal} isOpen={isModalOpen} title={slide.modalTitle}>
				{slide.component}
			</Modal>
		</>
	);
}
