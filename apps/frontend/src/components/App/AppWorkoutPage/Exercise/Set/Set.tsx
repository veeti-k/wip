import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import type { RouterOutputs } from "@gym/api";

import { Card } from "~components/_ui/Card";
import { Input } from "~components/_ui/Input";
import { animateHeightProps, dragStuff } from "~utils/animations";
import { dragActions } from "~utils/dragActions";
import { useDebouncedValue } from "~utils/useDebouncedValue";
import { useIsMounted } from "~utils/useIsMounted";

import { useRemoveSetMutation } from "./removeSetMutation";
import { useUpdateSetMutation } from "./updateSetMutation";

type Props = {
	set: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number]["sets"][number];
};

export const Set = ({ set }: Props) => {
	const updateMutation = useUpdateSetMutation({
		exerciseId: set.exerciseId,
		workoutId: set.workoutId,
	});
	const removeMutation = useRemoveSetMutation({
		exerciseId: set.exerciseId,
		workoutId: set.workoutId,
	});

	const [reps, setReps] = useDebouncedValue(set.reps, 250);
	const [weight, setWeight] = useDebouncedValue(set.weight, 250);
	const [duplicates, setDuplicates] = useState(set.duplicates);
	const mounted = useIsMounted();

	const removeSet = () =>
		removeMutation
			.mutateAsync({ setId: set.id })
			.catch((e) => toast.error(`Failed to delete set! ${e}`));

	const leftDrag = () => {
		if (duplicates > 1) {
			setDuplicates((prev) => prev - 1);
		} else {
			removeSet();
		}
	};

	const rightDrag = () => {
		setDuplicates((prev) => prev + 1);
	};

	useEffect(() => {
		if (!mounted) return;

		updateMutation.mutateAsync({ setId: set.id, reps, weight, duplicates });
	}, [reps, weight, duplicates]);

	return (
		<motion.div
			className="flex flex-col"
			{...dragActions(leftDrag, rightDrag)}
			{...dragStuff}
			{...animateHeightProps}
		>
			<Card
				variant={2}
				className="border-primary-800 mt-2 flex flex-col items-center gap-2 rounded-md p-2 py-2"
			>
				<div className="flex flex-col">
					<AnimatePresence initial={false}>
						{duplicates > 1 && (
							<motion.div {...animateHeightProps}>
								<h3 className="mb-2">{duplicates}x</h3>
							</motion.div>
						)}
					</AnimatePresence>

					<div className="flex gap-2">
						<Input
							type="number"
							step=".01"
							label="Reps"
							defaultValue={reps ?? ""}
							onChange={(e) => setReps(parseInt(e.target.value))}
						/>
						<Input
							type="number"
							step=".01"
							label="(kg) Weight"
							defaultValue={weight ?? ""}
							onChange={(e) => setWeight(parseInt(e.target.value))}
						/>
					</div>
				</div>
			</Card>
		</motion.div>
	);
};
