import { useEffect } from "react";

import type { RouterOutputs } from "@gym/api";

import { Input } from "~components/_ui/Input";
import { trpc } from "~trpcReact/trpcReact";
import { useDebouncedValue } from "~utils/useDebouncedValue";

type Props = {
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
};

export const WorkoutInputs = ({ workout }: Props) => {
	const [notes, setNotes] = useDebouncedValue(workout.notes, 250);
	const [bodyWeight, setBodyWeight] = useDebouncedValue(workout.bodyWeight, 250);

	const trpcCtx = trpc.useContext();
	const mutation = trpc.workout.updateWorkout.useMutation({
		onSuccess: () => trpcCtx.workout.getOne.invalidate({ id: workout.id }),
	});

	useEffect(() => {
		if (notes !== workout.notes) {
			mutation.mutateAsync({ workoutId: workout.id, notes });
		}
	}, [notes]);

	return (
		<div className="flex flex-col gap-3">
			<Input
				label="Notes"
				defaultValue={notes ?? ""}
				onChange={(e) => setNotes(e.target.value)}
			/>

			<Input
				label="(kg) Bodyweight"
				defaultValue={bodyWeight ?? ""}
				onChange={(e) => setBodyWeight(parseFloat(e.target.value))}
			/>
		</div>
	);
};
