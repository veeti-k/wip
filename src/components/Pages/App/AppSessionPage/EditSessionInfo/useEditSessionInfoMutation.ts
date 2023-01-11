import { trpc } from "~utils/trpc";

export function useEditSessionInfoMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.editSessionInfo.useMutation({
		onSuccess: (updatedSession) => {
			trpcCtx.session.getOne.setData({ id: updatedSession.id }, (oldData) => {
				if (!oldData) {
					return null;
				}

				return {
					...oldData,
					name: updatedSession.name,
					createdAt: updatedSession.createdAt,
					stoppedAt: updatedSession.stoppedAt,
				};
			});
		},
		onSettled: () => trpcCtx.session.invalidate(),
	});
}
