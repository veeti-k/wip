import { trpc } from "~trpcReact/trpcReact";

export const useFinishWorkoutMutation = () => {
	const trpcCtx = trpc.useContext();

	return trpc.workout.finishWorkout.useMutation({
		onSuccess: (updatedWorkout) => {
			trpcCtx.workout.getOne.setData({ id: updatedWorkout.id }, (oldData) => {
				if (!oldData) return null;

				return {
					...oldData,
					stoppedAt: updatedWorkout.stoppedAt,
				};
			});
		},
	});
};
