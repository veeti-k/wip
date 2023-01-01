import { Tab } from "@headlessui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "~components/_ui/Button";
import { Modal, useModal } from "~components/_ui/Modal";
import { classNames } from "~utils/classNames";

import { AddExercise } from "./AddExercise";
import { CreateExerciseModal } from "./CreateExercise";

type Props = {
	workoutId: string;
};

export const AddExerciseTabsModal = ({ workoutId }: Props) => {
	const { closeModal, openModal, isModalOpen } = useModal();
	const [selectedTab, setSelectedTab] = useState(0);

	const form = useForm({
		defaultValues: {
			exerciseName: "",
			modelExerciseId: "",
		},
	});

	return (
		<>
			<Button onClick={openModal}>Add an exercise</Button>

			<Modal closeModal={closeModal} isOpen={isModalOpen}>
				<Tab.Group selectedIndex={selectedTab} onChange={(i) => setSelectedTab(i)}>
					<Tab.List className="flex justify-between">
						<Tab
							className={({ selected }) =>
								classNames(
									"w-full rounded-tl-xl p-4 outline-none outline-[3px] transition-[outline,_color,_background,_border] duration-200",
									selected ? "bg-primary-1100 font-medium" : "bg-primary-900"
								)
							}
						>
							Add exercise
						</Tab>
						<Tab
							className={({ selected }) =>
								classNames(
									"w-full rounded-tr-xl p-4 outline-none outline-[3px] transition-[outline,_color,_background,_border] duration-200",
									selected ? "border-primary-1100 font-medium" : "bg-primary-900"
								)
							}
						>
							Create exercise
						</Tab>
					</Tab.List>

					<Tab.Panels>
						<Tab.Panel>
							<AddExercise
								workoutId={workoutId}
								form={form}
								closeModal={closeModal}
								setSelectedTab={setSelectedTab}
							/>
						</Tab.Panel>
						<Tab.Panel>
							<CreateExerciseModal initialName={form.getValues().exerciseName} />
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>
			</Modal>
		</>
	);
};
