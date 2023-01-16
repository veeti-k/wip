import format from "date-fns/format";
import { useForm } from "react-hook-form";

import { Button } from "~components/Ui/Button";
import { Input } from "~components/Ui/Input";
import { Modal, useModal } from "~components/Ui/Modal";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";
import type { EditSessionInfoFormType } from "~validation/session/editSessionInfo";

import { FinishSession } from "../FinishWorkout/FinishWorkout";
import { useEditSessionInfoMutation } from "./useEditSessionInfoMutation";

type Props = {
	session: NonNullable<RouterOutputs["session"]["getOne"]>;
};

export function EditSessionInfo({ session }: Props) {
	const { closeModal, isModalOpen, openModal } = useModal();

	const mutation = useEditSessionInfoMutation();

	const form = useForm<EditSessionInfoFormType>({
		defaultValues: {
			name: session.name,
			startedAt: getHtmlDate(session.startedAt),
			stoppedAt: session.stoppedAt ? getHtmlDate(session.stoppedAt) : null,
		},
	});

	function onSubmit(values: EditSessionInfoFormType) {
		mutation
			.mutateAsync({
				sessionId: session.id,
				name: values.name,
				startedAt: new Date(values.startedAt),
				stoppedAt: values.stoppedAt ? new Date(values.stoppedAt) : null,
			})
			.then(() => closeModal())
			.catch(errorMsg("Failed to update session"));
	}

	return (
		<>
			<Button className="!py-1 !px-2 text-sm" onClick={openModal}>
				Edit
			</Button>

			<Modal closeModal={closeModal} isOpen={isModalOpen} title="Edit session">
				<form
					className="flex flex-col gap-4 p-4"
					onSubmit={form.handleSubmit(onSubmit)}
					noValidate
				>
					<div className="flex flex-col gap-3">
						<Input label="Name" {...form.register("name")} />

						<Input
							label="Started at"
							type="datetime-local"
							{...form.register("startedAt")}
						/>

						{session.stoppedAt ? (
							<Input
								label="Finished at"
								type="datetime-local"
								{...form.register("stoppedAt")}
							/>
						) : (
							<FinishSession
								onFinished={(updatedSession) =>
									updatedSession?.stoppedAt &&
									form.setValue(
										"stoppedAt",
										getHtmlDate(updatedSession.stoppedAt)
									)
								}
								session={session}
							/>
						)}
					</div>

					<div className="flex gap-3">
						<Button className="w-full" onClick={closeModal}>
							Cancel
						</Button>
						<Button className="w-full" intent="submit" disabled={mutation.isLoading}>
							{mutation.isLoading ? "Saving..." : "Save"}
						</Button>
					</div>
				</form>
			</Modal>
		</>
	);
}

function getHtmlDate(date: Date) {
	return `${format(date, "yyyy-MM-dd")}T${format(date, "HH:mm")}`;
}
