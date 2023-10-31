import { Button } from "~components/Ui/Button";
import { Modal } from "~components/Ui/Modal";

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
