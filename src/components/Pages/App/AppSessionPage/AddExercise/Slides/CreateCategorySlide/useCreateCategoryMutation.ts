import { trpc } from "~utils/trpc";

export function useCreateCategoryMutation() {
	const trpcCtx = trpc.useContext();

	return trpc.exercise.createCategory.useMutation({
		onSuccess: (createdCategory) => {
			trpcCtx.exercise.getModelExercises.setData(undefined, (oldData) =>
				oldData ? [...oldData, createdCategory] : undefined
			);
		},
		onSettled: () => trpcCtx.exercise.getModelExercises.invalidate(),
	});
}
