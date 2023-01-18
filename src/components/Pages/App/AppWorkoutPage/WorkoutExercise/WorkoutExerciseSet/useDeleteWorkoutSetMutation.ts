import { trpc } from "~utils/trpc";

export function useDeleteWorkoutSetMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.deleteExerciseSet.useMutation({
		onMutate: async ({ setId, exerciseId, workoutId }) => {
			await trpcCtx.workout.getOne.cancel({ workoutId });

			const oldData = trpcCtx.workout.getOne.getData({ workoutId });

			trpcCtx.workout.getOne.setData({ workoutId }, (oldData) => {
				if (!oldData) {
					return undefined;
				}

				return {
					...oldData,
					exercises: oldData.exercises.map((exercise) => {
						if (exercise.id !== exerciseId) {
							return exercise;
						}

						return {
							...exercise,
							sets: exercise.sets.filter((set) => set.id !== setId),
						};
					}),
				};
			});

			return { oldData };
		},
		onError: (error, vars, context) => {
			context?.oldData &&
				trpcCtx.workout.getOne.setData({ workoutId: workoutId }, context.oldData);

			trpcCtx.workout.getOne.invalidate({ workoutId: workoutId });
		},
	});
}
