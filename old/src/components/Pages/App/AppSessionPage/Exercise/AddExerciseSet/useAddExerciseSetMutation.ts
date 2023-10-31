import { trpc } from "~utils/trpc";

export function useAddExerciseSetMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.addExerciseSet.useMutation({
		onSuccess: (updatedSession, { sessionId }) => {
			trpcCtx.session.getOne.setData({ sessionId }, updatedSession);
		},
		onSettled: () => {
			trpcCtx.session.invalidate();
		},
	});
}
