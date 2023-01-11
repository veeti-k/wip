import { trpc } from "~utils/trpc";

export function useDeleteExerciseMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.deleteExercise.useMutation({
		onSuccess: (_, { sessionId, exerciseId }) => {
			trpcCtx.session.getOne.setData({ id: sessionId }, (oldData) => {
				if (!oldData) {
					return null;
				}

				return {
					...oldData,
					exercises: oldData.exercises.filter((exercise) => exercise.id !== exerciseId),
				};
			});
		},
		onSettled: () => trpcCtx.session.getOnGoing.invalidate(),
	});
}
