import { trpc } from "~utils/trpc";

type Props = {
	sessionId: string;
	exerciseId: string;
};

export function useDeleteSetMutation({ exerciseId, sessionId }: Props) {
	const trpcCtx = trpc.useContext();

	return trpc.session.deleteExerciseSet.useMutation({
		onMutate: async (vars) => {
			await trpcCtx.session.getOne.cancel({ sessionId: sessionId });

			const oldData = trpcCtx.session.getOne.getData({ sessionId: sessionId });

			trpcCtx.session.getOne.setData({ sessionId: sessionId }, (oldData) => {
				if (!oldData) {
					return undefined;
				}

				return {
					...oldData,
					exercises: oldData.exercises.map((exercise) => {
						if (exercise._id.toString() !== exerciseId) {
							return exercise;
						}

						return {
							...exercise,
							sets: exercise.sets.filter((set) => set._id.toString() !== vars.setId),
						};
					}),
				};
			});

			return { oldData };
		},
		onError: (error, vars, context) => {
			context?.oldData &&
				trpcCtx.session.getOne.setData({ sessionId: sessionId }, context.oldData);

			trpcCtx.session.getOne.invalidate({ sessionId: sessionId });
		},
	});
}
