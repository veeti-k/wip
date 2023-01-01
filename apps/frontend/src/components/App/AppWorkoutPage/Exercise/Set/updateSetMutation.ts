import { trpc } from "~trpcReact/trpcReact";

type Props = {
	workoutId: string;
	exerciseId: string;
};

export const useUpdateSetMutation = ({ exerciseId, workoutId }: Props) => {
	const trpcCtx = trpc.useContext();

	return trpc.workout.updateExerciseSet.useMutation({
		onMutate: async (vars) => {
			await trpcCtx.workout.getOne.cancel({ id: workoutId });

			const oldData = await trpcCtx.workout.getOne.getData({ id: workoutId });

			trpcCtx.workout.getOne.setData({ id: workoutId }, (oldData) => {
				if (!oldData) return undefined;

				return {
					...oldData,
					exercises: oldData.exercises.map((exercise) => {
						if (exercise.id !== exerciseId) return exercise;

						return {
							...exercise,
							sets: exercise.sets.map((set) => {
								if (set.id !== vars.setId) return set;

								return {
									...set,
									weight: vars.weight,
									reps: vars.reps,
									duplicates: vars.duplicates,
								};
							}),
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
};
