import { Button } from "~components/_ui/Button";
import { Modal } from "~components/_ui/Modal";

import { useAddExerciseContext } from "./AddExerciseContext";

export const AddExerciseModal = () => {
	const { getOpenSlide, setSlide, closeModal, isModalOpen, openModal } = useAddExerciseContext();

	const slide = getOpenSlide();

	if (!slide) return null;

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
};

const exercises = {
	abs: [{ name: "Crunches" }, { name: "Leg raises" }],
	back: [
		{ name: "Assisted chin up" },
		{ name: "Assisted pull up" },
		{ name: "Barbell row" },
		{ name: "Cable row" },
		{ name: "Chin up" },
		{ name: "Deadlift" },
		{ name: "Dumbbell row" },
		{ name: "Hyperextensions" },
		{ name: "Pull up" },
		{ name: "Pulldowns" },
	],
	biceps: [
		{ name: "Barbell bicep curl" },
		{ name: "Concentration curl" },
		{ name: "Dumbbell bicep curl" },
		{ name: "Hammer curl" },
		{ name: "Hvc" },
	],
	cardio: [
		{ name: "Cycling" },
		{ name: "Eliptical trainer" },
		{ name: "Rowing machine" },
		{ name: "Running" },
		{ name: "Treadmill" },
		{ name: "Walking" },
	],
	chest: [
		{ name: "Bench press" },
		{ name: "Cable crossovers" },
		{ name: "Dumbbell flies" },
		{ name: "Dumbbell press" },
		{ name: "Incline bench press" },
		{ name: "Incline dumbbell press" },
	],
	legs: [
		{ name: "Calf raises" },
		{ name: "Front squat" },
		{ name: "Leg curls" },
		{ name: "Leg extensions" },
		{ name: "Leg press" },
		{ name: "Lunges" },
		{ name: "Seated calf raises" },
		{ name: "Squat" },
		{ name: "Straight leg deadlifts" },
	],
	shoulders: [
		{ name: "Dumbbell lateral raises" },
		{ name: "Military press" },
		{ name: "Shoulder dumbbell press" },
		{ name: "Upright rows" },
	],
	triceps: [
		{ name: "Assisted dips" },
		{ name: "Close grip bench press" },
		{ name: "Dips" },
		{ name: "Pushdowns" },
		{ name: "Triceps extensions" },
	],
};
