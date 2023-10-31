import { trpc } from "~utils/trpc";

export function useAddExerciseMutation() {
	const trpcCtx = trpc.useContext();
	return trpc.session.addExercise.useMutation({
		onSuccess: (updatedSession, { sessionId }) => {
			trpcCtx.session.getOne.setData({ sessionId: sessionId }, updatedSession);
		},
		onSettled: (_, __, { sessionId }) => {
			trpcCtx.session.getOne.invalidate({ sessionId: sessionId });
		},
	});
}
