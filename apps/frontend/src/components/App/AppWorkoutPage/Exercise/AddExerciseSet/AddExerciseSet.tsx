import type { RouterOutputs } from "@gym/api";

import { Button } from "~components/_ui/Button";
import { errorMsg } from "~utils/errorMsg";

import { useAddExerciseSetMutation } from "./useAddExerciseSetMutation";

type Props = {
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
};

export const AddExerciseSet = ({ exercise }: Props) => {
	const mutation = useAddExerciseSetMutation();

	const addSet = () =>
		mutation
			.mutateAsync({
				exerciseId: exercise.id,
				workoutId: exercise.workoutId,
			})
			.catch(errorMsg("Failed to add set"));

	return (
		<Button className="w-full" onClick={addSet} disabled={mutation.isLoading}>
			{mutation.isLoading ? "Adding..." : "Add a set"}
		</Button>
	);
};
