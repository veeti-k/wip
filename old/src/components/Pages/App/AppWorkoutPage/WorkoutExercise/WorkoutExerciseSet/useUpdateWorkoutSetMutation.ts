import { trpc } from "~utils/trpc";

export function useUpdateWorkoutSetMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.updateExerciseSet.useMutation({
		onMutate: async ({ setId, exerciseId, workoutId, count, reps }) => {
			await trpcCtx.workout.getOne.cancel({ workoutId: workoutId });

			const oldData = trpcCtx.workout.getOne.getData({ workoutId: workoutId });

			trpcCtx.workout.getOne.setData({ workoutId: workoutId }, (oldData) => {
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
							sets: exercise.sets.map((set) => {
								if (set.id !== setId) {
									return set;
								}

								return {
									...set,
									reps: reps,
									count: count,
								};
							}),
						};
					}),
				};
			});

			return { oldData };
		},
		onError: (error, { workoutId }, context) => {
			context?.oldData && trpcCtx.workout.getOne.setData({ workoutId }, context.oldData);

			trpcCtx.workout.getOne.invalidate({ workoutId });
		},
		onSettled: () => trpcCtx.workout.invalidate(),
	});
}
