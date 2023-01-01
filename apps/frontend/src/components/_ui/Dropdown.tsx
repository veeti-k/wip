import { Menu, Transition } from "@headlessui/react";
import { Fragment, MouseEvent, ReactNode } from "react";

import { Button } from "./Button";
import { DotsVertical } from "./Icons/DotsVertical";

type DropdownProps = {
	children: ReactNode;
};

export const Dropdown = ({ children }: DropdownProps) => {
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button as={Button} intent="submit">
					<DotsVertical />
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="bg-primary-1000 border-primary-700 divide-primary-800 absolute right-0 mt-2 w-56 origin-top-right divide-y rounded-md border py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					{children}
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

type DropdownMenuItemProps = {
	children: ReactNode;
	onClick?: (event: MouseEvent) => void;
};

export const DropdownMenuItem = ({ onClick, children }: DropdownMenuItemProps) => {
	return (
		<Menu.Item>
			{({ active }) => (
				<button
					className={`${
						active && "bg-primary-700"
					} group flex w-full items-center px-4 py-2 text-sm`}
					onClick={(e) => onClick && onClick(e)}
				>
					{children}
				</button>
			)}
		</Menu.Item>
	);
};
