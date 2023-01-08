import { trpc } from "~trpcReact/trpcReact";

export function useDeleteExerciseMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.workout.deleteExercise.useMutation({
		onSuccess: (_, { workoutId, exerciseId }) => {
			trpcCtx.workout.getOne.setData({ id: workoutId }, (oldData) => {
				if (!oldData) {
					return null;
				}

				return {
					...oldData,
					exercises: oldData.exercises.filter((exercise) => exercise.id !== exerciseId),
				};
			});
		},
		onSettled: () => trpcCtx.workout.getOnGoing.invalidate(),
	});
}
