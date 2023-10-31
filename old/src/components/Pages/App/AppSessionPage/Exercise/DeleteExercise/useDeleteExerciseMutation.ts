import { trpc } from "~utils/trpc";

export function useDeleteExerciseMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.deleteExercise.useMutation({
		onSuccess: (updatedSession, { sessionId }) => {
			trpcCtx.session.getOne.setData({ sessionId }, updatedSession);
		},
		onSettled: () => trpcCtx.session.invalidate(),
	});
}
