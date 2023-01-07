import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useRef, useState } from "react";

import { Card } from "./Cards/Card";

type Props = {
	title: string;
	children: ReactNode;
	closeModal: () => void;
	isOpen: boolean;
};

export const Modal = ({ title, children, closeModal, isOpen }: Props) => {
	const initialFocusRef = useRef(null);

	return (
		<AnimatePresence>
			{isOpen && (
				<Dialog
					static
					open={isOpen}
					className="z-10"
					onClose={() => closeModal()}
					initialFocus={initialFocusRef}
				>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							transition: { duration: 0.09 },
						}}
						exit={{ opacity: 0, transition: { duration: 0.1 } }}
						className="bg-primary-1200/50 fixed inset-0 backdrop-blur-sm"
					/>

					<Dialog.Panel
						key={title}
						className="absolute left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-[100%] rounded-xl shadow-xl"
					>
						<Card
							as={motion.div}
							initial={{ opacity: 0, scale: 0.97 }}
							animate={{
								opacity: 1,
								y: 0,
								scale: 1,
								height: "auto",
								transition: { duration: 0.1 },
							}}
							exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.1 } }}
						>
							<Dialog.Title
								ref={initialFocusRef}
								as="h3"
								className="px-4 pt-4 text-lg font-medium leading-6"
							>
								{title}
							</Dialog.Title>

							{children}
						</Card>
					</Dialog.Panel>
				</Dialog>
			)}
		</AnimatePresence>
	);
};

export const useModal = () => {
	const [isModalOpen, setIsOpen] = useState(false);

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	return {
		isModalOpen,
		openModal,
		closeModal,
	};
};
