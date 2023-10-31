import { trpc } from "~utils/trpc";

export function useStartSessionMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.createFromWorkout.useMutation({
		onSuccess: (createdSession) => {
			trpcCtx.session.getOne.setData({ sessionId: createdSession.id }, createdSession);

			trpcCtx.session.getOnGoing.setData(undefined, (oldData) => {
				if (!oldData) return [createdSession];

				return [...oldData, createdSession];
			});
		},
		onSettled: () => {
			trpcCtx.session.invalidate();
		},
	});
}
