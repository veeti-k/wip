import { trpc } from "~utils/trpc";

export function useFinishSessionMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.finish.useMutation({
		onSuccess: (updatedSession, { sessionId }) => {
			trpcCtx.session.getOne.setData({ sessionId }, updatedSession);
		},
		onSettled: () => {
			trpcCtx.session.invalidate();
		},
	});
}
