import { Dialog, Transition } from "@headlessui/react";
import type { ReactNode } from "react";
import { Fragment, useRef, useState } from "react";

type Props = {
	title: string;
	children: ReactNode;
	closeModal: () => void;
	isOpen: boolean;
};

export function Modal({ title, children, closeModal, isOpen }: Props) {
	const initialFocusRef = useRef(null);

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				onClose={closeModal}
				initialFocus={initialFocusRef}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-[90ms]"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-[110ms]"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/40" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-3">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-[100ms]"
							enterFrom="opacity-0 scale-[96%]"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-[110ms]"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-[96%]"
						>
							<Dialog.Panel className="border-primary-800 bg-primary-1100 w-full max-w-sm overflow-hidden rounded-xl border shadow-xl">
								<Dialog.Title
									as="h1"
									className="px-4 pt-4 text-lg font-medium leading-6"
									ref={initialFocusRef}
								>
									{title}
								</Dialog.Title>

								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

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
