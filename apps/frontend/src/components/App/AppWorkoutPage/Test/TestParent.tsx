import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import useMeasure from "react-use-measure";

import { Button } from "~components/_ui/Button";
import { Modal, useModal } from "~components/_ui/Modal";

import { TestChild1 } from "./TestChild1";
import { TestChild2 } from "./TestChild2";

const animProps = {
	initial: { opacity: 0, x: 50 },
	animate: { opacity: 1, x: 0 },
	exit: { opacity: 0, x: -50 },
	transition: { duration: 0.2 },
};

export const TestParent = () => {
	const { closeModal, isModalOpen, openModal } = useModal();
	const [slides, setSlides] = useState<ReactNode[] | null>([<TestChild1 />, <TestChild2 />]);
	const [openSlideIndex, setOpenSlideIndex] = useState(1);
	const [ref, bounds] = useMeasure();

	const nextSlide = () => {
		if (slides?.length && openSlideIndex + 1 > slides?.length - 1) {
			setOpenSlideIndex(0);
		} else {
			setOpenSlideIndex(openSlideIndex + 1);
		}
	};

	return (
		<>
			<Button onClick={openModal}>Open</Button>

			<Modal closeModal={closeModal} isOpen={isModalOpen} title="test">
				<motion.div animate={{ height: bounds.height }} transition={{ duration: 0.2 }}>
					<AnimatePresence mode="wait">
						<motion.div {...animProps} ref={ref} key={openSlideIndex} className="p-4">
							{slides?.[openSlideIndex]}
							<Button onClick={() => nextSlide()}>Next</Button>
						</motion.div>

						{/* {openSlideIndex === 1 ? (
							<motion.div {...animProps} ref={ref} key={1} className="p-4">
								<TestChild1 />
								<Button onClick={() => setOpenSlideIndex(2)}>Next</Button>
							</motion.div>
						) : openSlideIndex === 2 ? (
							<motion.div {...animProps} ref={ref} key={2} className="p-4">
								<TestChild2 />
								<Button onClick={() => setOpenSlideIndex(1)}>Prev</Button>
								<Button onClick={() => setOpenSlideIndex(3)}>Next</Button>
							</motion.div>
						) : openSlideIndex === 3 ? (
							<motion.div {...animProps} ref={ref} key={3} className="p-4">
								<h1>Tets 3</h1>
								<Button onClick={() => setOpenSlideIndex(1)}>Next</Button>
							</motion.div>
						) : null} */}
					</AnimatePresence>
				</motion.div>
			</Modal>
		</>
	);
};
