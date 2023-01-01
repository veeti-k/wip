import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";

import { Card } from "./Card";

type Props = {
	title?: string;
	children: ReactNode;
	closeModal: () => void;
	isOpen: boolean;
};

export const Modal = ({ title, children, closeModal, isOpen }: Props) => {
	return (
		<AnimatePresence initial={false}>
			{isOpen && (
				<Dialog
					static
					as={motion.div}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, height: "auto", transition: { duration: 0.15 } }}
					exit={{ opacity: 0, transition: { duration: 0.075 } }}
					open={isOpen}
					className="relative z-10"
					onClose={() => closeModal()}
				>
					<motion.div className="bg-primary-1200/50 fixed inset-0 backdrop-blur-sm" />

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex justify-center p-1">
							<Dialog.Panel
								as={motion.div}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{
									opacity: 1,
									scale: 1,
									transition: { duration: 0.15 },
								}}
								exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.075 } }}
								className="relative top-[15rem] w-full max-w-sm"
							>
								<Card className="w-full rounded-xl shadow-xl">
									{title && (
										<Dialog.Title
											as="h3"
											className="px-4 pt-4 text-lg font-medium leading-6"
										>
											{title}
										</Dialog.Title>
									)}

									{children}
								</Card>
							</Dialog.Panel>
						</div>
					</div>
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
