import { trpc } from "~trpcReact/trpcReact";

export const useAddExerciseSetMutation = () => {
	const trpcCtx = trpc.useContext();

	return trpc.workout.addExerciseSet.useMutation({
		onSuccess: (createdSet) => {
			trpcCtx.workout.getOne.setData({ id: createdSet.workoutId }, (oldData) => {
				if (!oldData) return null;

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
			trpcCtx.workout.getOnGoing.invalidate();
		},
	});
};
