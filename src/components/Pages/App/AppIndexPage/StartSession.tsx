import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "~components/Ui/Button";
import { Input } from "~components/Ui/Input";
import { Modal, useModal } from "~components/Ui/Modal";
import { errorMsg } from "~utils/errorMsg";
import type { RouterInputs } from "~utils/trpc";
import { StartSessionFormType, startSessionFormSchema } from "~validation/session/startSession";

import { useCreateSessionMutation } from "./useCreateSessionMutation";

export function StartSession() {
	const { closeModal, isModalOpen, openModal } = useModal();

	const form = useForm<StartSessionFormType>({
		resolver: zodResolver(startSessionFormSchema),
	});

	const mutation = useCreateSessionMutation();

	async function onSubmit(values: RouterInputs["session"]["create"]) {
		return mutation
			.mutateAsync(values)
			.then(() => {
				closeModal();
				form.reset();
			})
			.catch(errorMsg("Failed to start session"));
	}

	return (
		<>
			<Button onClick={openModal}>Start a new session</Button>

			<Modal title="Start a new session" closeModal={closeModal} isOpen={isModalOpen}>
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
}
