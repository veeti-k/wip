import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import type { RouterOutputs } from "@gym/api";
import { createExercise } from "@gym/validation";

import { Button } from "~components/_ui/Button";
import { Input } from "~components/_ui/Input";
import { Modal } from "~components/_ui/Modal";
import { Select } from "~components/_ui/Select";
import { trpc } from "~trpcReact/trpcReact";

type Props = {
	initialName: string;
	closeModal: () => void;
	isModalOpen: boolean;
	categories: RouterOutputs["exercise"]["getModelExercises"];
};

export const CreateExerciseModal = ({
	initialName,
	closeModal,
	isModalOpen,
	categories,
}: Props) => {
	const mutation = trpc.exercise.createExercise.useMutation();
	const trpcCtx = trpc.useContext();

	const form = useForm<createExercise.FormType>({
		resolver: zodResolver(createExercise.form),
	});

	const onSubmit = (values: createExercise.FormType) => {
		toast
			.promise(mutation.mutateAsync(values), {
				loading: "Creating exercise...",
				success: "Exercise created!",
				error: "Failed to create exercise",
			})
			.then(() => {
				form.reset();
				trpcCtx.exercise.getModelExercises.invalidate();
			})
			.catch((err) => toast.error(err?.message || "Unknown error"));
	};

	useEffect(() => {
		form.setValue("name", initialName);
	}, [initialName]);

	useEffect(() => {
		return () => {
			form.reset();
		};
	}, []);

	return (
		<Modal isOpen={isModalOpen} closeModal={closeModal} title="Create exercise">
			<form
				noValidate
				className="flex flex-col gap-3 p-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<Input
					label="Name"
					error={form.formState.errors.name?.message}
					{...form.register("name")}
				/>

				<Select
					label="Category"
					required
					error={form.formState.errors.categoryId?.message}
					{...form.register("categoryId")}
				>
					<option value="">Select category</option>

					{categories?.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</Select>

				<Select
					multiple
					label="Select fields"
					error={form.formState.errors.enabledFields?.message}
					required
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
