import { trpc } from "~trpcReact/trpcReact";

type Props = {
	workoutId: string;
	exerciseId: string;
};

export function useDeleteSetMutation({ exerciseId, workoutId }: Props) {
	const trpcCtx = trpc.useContext();

	return trpc.workout.deleteExerciseSet.useMutation({
		onMutate: async (vars) => {
			await trpcCtx.workout.getOne.cancel({ id: workoutId });

			const oldData = trpcCtx.workout.getOne.getData({ id: workoutId });

			trpcCtx.workout.getOne.setData({ id: workoutId }, (oldData) => {
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
							sets: exercise.sets.filter((set) => set.id !== vars.setId),
						};
					}),
				};
			});

			return { oldData };
		},
		onError: (error, vars, context) => {
			context?.oldData && trpcCtx.workout.getOne.setData({ id: workoutId }, context.oldData);

			trpcCtx.workout.getOne.invalidate({ id: workoutId });
		},
	});
}
