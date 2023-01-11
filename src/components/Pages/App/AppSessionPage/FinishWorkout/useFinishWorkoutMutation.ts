import { trpc } from "~utils/trpc";

export function useFinishSessionMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.finishSession.useMutation({
		onSuccess: (updatedSession) => {
			trpcCtx.session.getOne.setData({ id: updatedSession.id }, (oldData) => {
				if (!oldData) {
					return null;
				}

				return {
					...oldData,
					stoppedAt: updatedSession.stoppedAt,
				};
			});
		},
	});
}
