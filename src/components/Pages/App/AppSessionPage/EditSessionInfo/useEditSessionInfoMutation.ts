import { trpc } from "~utils/trpc";

export function useEditSessionInfoMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.editSessionInfo.useMutation({
		onSuccess: (updatedSession, { sessionId }) => {
			trpcCtx.session.getOne.setData({ sessionId }, updatedSession);
		},
		onSettled: () => trpcCtx.session.invalidate(),
	});
}
