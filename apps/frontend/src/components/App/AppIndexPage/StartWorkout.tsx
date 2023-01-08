import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { RouterInputs } from "@gym/api";
import { startSession } from "@gym/validation";

import { Button } from "~components/_ui/Button";
import { Input } from "~components/_ui/Input";
import { Modal, useModal } from "~components/_ui/Modal";
import { errorMsg } from "~utils/errorMsg";

import { useCreateWorkoutMutation } from "./useCreateWorkoutMutation";

export const StartWorkout = () => {
	const { closeModal, isModalOpen, openModal } = useModal();

	const form = useForm<startSession.FormType>({
		resolver: zodResolver(startSession.form),
	});

	const mutation = useCreateWorkoutMutation();

	const onSubmit = async (values: RouterInputs["workout"]["createWorkout"]) =>
		mutation
			.mutateAsync(values)
			.then(() => {
				closeModal();
				form.reset();
			})
			.catch(errorMsg("Failed to start workout"));

	return (
		<>
			<Button onClick={openModal}>Start a new workout</Button>

			<Modal title="Start a new workout" closeModal={closeModal} isOpen={isModalOpen}>
				<form
					noValidate
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-3 p-4"
				>
					<Input
						label="Name"
						placeholder="Leg day"
						error={form.formState.errors.name?.message}
						{...form.register("name")}
					/>

					<div className="flex w-full gap-3">
						<Button className="w-full" onClick={closeModal}>
							Cancel
						</Button>
						<Button
							intent="submit"
							type="submit"
							className="w-full"
							disabled={mutation.isLoading}
						>
							{mutation.isLoading ? "Starting..." : "Start"}
						</Button>
					</div>
				</form>
			</Modal>
		</>
	);
};
