import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { createExercise } from "@gym/validation";

import { Button } from "~components/_ui/Button";
import { Input } from "~components/_ui/Input";
import { Modal } from "~components/_ui/Modal";
import { Select } from "~components/_ui/Select";
import { trpc } from "~trpcReact/trpcReact";

type Props = {
	closeModal: () => void;
	openModal: () => void;
	isModalOpen: boolean;
	initialName?: string;
	onExerciseCreated: (modelExerciseId: string) => void;
};

export const CreateExerciseModal = ({
	closeModal,
	isModalOpen,
	initialName,
	onExerciseCreated,
}: Props) => {
	const mutation = trpc.exercise.createExercise.useMutation();
	const utils = trpc.useContext();

	const form = useForm<createExercise.FormType>({
		resolver: zodResolver(createExercise.form),
		defaultValues: { name: initialName },
	});

	const onSubmit = (values: createExercise.FormType) => {
		toast
			.promise(mutation.mutateAsync(values), {
				loading: "Creating exercise...",
				success: "Exercise created!",
				error: "Failed to create exercise",
			})
			.then((createdModelExercise) => {
				closeModal();
				form.reset();
				onExerciseCreated?.(createdModelExercise.id);
				utils.exercise.getModelExercises.setData(undefined, (oldData) => [
					...(oldData ? oldData : []),
					createdModelExercise,
				]);
				utils.exercise.getModelExercises.invalidate();
			})
			.catch((err) => toast.error(err?.message || "Unknown error"));
	};

	useEffect(() => {
		initialName && isModalOpen && form.setValue("name", initialName);
	}, [initialName, isModalOpen]);

	return (
		<Modal
			closeModal={() => {
				closeModal();
				form.reset();
			}}
			isOpen={isModalOpen}
			title="Create an exercise"
		>
			<form
				className="flex flex-col gap-3 p-3"
				noValidate
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Input
					label="Name"
					error={form.formState.errors.name?.message}
					{...form.register("name")}
				/>

				<Select
					multiple
					label="Select fields"
					error={form.formState.errors.enabledFields?.message}
					{...form.register("enabledFields")}
				>
					<option value="weight">Weight</option>
					<option value="reps">Reps</option>
					<option value="time">Time</option>
					<option value="distance">Distance</option>
					<option value="kcal">KCal</option>
				</Select>

				<div className="flex gap-3">
					<Button className="w-full" onClick={closeModal}>
						Cancel
					</Button>

					<Button className="w-full" intent="submit" type="submit">
						Add
					</Button>
				</div>
			</form>
		</Modal>
	);
};
