import { trpc } from "~trpcReact/trpcReact";

export const useDeleteExerciseMutation = () => {
	const trpcCtx = trpc.useContext();

	return trpc.workout.deleteExercise.useMutation({
		onSuccess: (deletedExercise) => {
			trpcCtx.workout.getOne.setData({ id: deletedExercise.workoutId }, (oldData) => {
				if (!oldData) return null;

				return {
					...oldData,
					exercises: oldData.exercises.filter(
						(exercise) => exercise.id !== deletedExercise.id
					),
				};
			});
		},
		onSettled: () => trpcCtx.workout.getOnGoing.invalidate(),
	});
};
