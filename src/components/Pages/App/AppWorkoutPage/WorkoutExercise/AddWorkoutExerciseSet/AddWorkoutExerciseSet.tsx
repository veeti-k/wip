import { Button } from "~components/Ui/Button";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";

import { useAddWorkoutExerciseSetMutation } from "./useAddWorkoutExerciseSetMutation";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
	lastSetRef: React.RefObject<HTMLDivElement>;
};

export function AddWorkoutExerciseSet({ workout, exercise, lastSetRef }: Props) {
	const mutation = useAddWorkoutExerciseSetMutation();

	function addSet() {
		return mutation
			.mutateAsync({
				exerciseId: exercise.id,
				workoutId: workout.id,
			})
			.then(() =>
				setTimeout(
					() =>
						lastSetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
					250
				)
			)
			.catch(errorMsg("Failed to add set"));
	}

	return (
		<Button className="w-full" onClick={addSet} disabled={mutation.isLoading}>
			{mutation.isLoading ? "Adding..." : "Add a set"}
		</Button>
	);
}
