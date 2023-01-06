import { trpc } from "~trpcReact/trpcReact";

export const useUpdateWorkoutMutation = () => {
	const trpcCtx = trpc.useContext();

	return trpc.workout.updateWorkout.useMutation({
		onSuccess: (updatedWorkout) => trpcCtx.workout.getOne.invalidate({ id: updatedWorkout.id }),
	});
};
