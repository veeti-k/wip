import { trpc } from "~utils/trpc";

export function useAddExerciseSetMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.session.addExerciseSet.useMutation({
		onSuccess: (createdSet) => {
			trpcCtx.session.getOne.setData({ id: createdSet.sessionId }, (oldData) => {
				if (!oldData) {
					return null;
				}

				return {
					...oldData,
					exercises: oldData.exercises.map((exercise) => {
						if (exercise.id === createdSet.exerciseId) {
							return {
								...exercise,
								sets: [...exercise.sets, createdSet],
							};
						}

						return exercise;
					}),
				};
			});
		},
		onSettled: () => {
			trpcCtx.session.getOnGoing.invalidate();
		},
	});
}
