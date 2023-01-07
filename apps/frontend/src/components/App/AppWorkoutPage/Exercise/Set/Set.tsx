import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Minus, Plus } from "tabler-icons-react";

import type { RouterOutputs } from "@gym/api";
import { hasExerciseField } from "@gym/db/modelExerciseFields";
import { updateExerciseSet } from "@gym/validation";

import { Button } from "~components/_ui/Button";
import { Card } from "~components/_ui/Cards/Card";
import { Input } from "~components/_ui/Input";
import { animateHeightProps } from "~utils/animations";
import { errorMsg } from "~utils/errorMsg";

import { useDeleteSetMutation } from "./useDeleteSetMutation";
import { useUpdateSetMutation } from "./useUpdateSetMutation";

type Props = {
	set: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number]["sets"][number];
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
	setRef?: React.RefObject<HTMLDivElement>;
	isLast: boolean;
};

export const Set = ({ set, exercise, setRef, isLast }: Props) => {
	const updateMutation = useUpdateSetMutation({
		exerciseId: set.exerciseId,
		workoutId: set.workoutId,
	});
	const removeMutation = useDeleteSetMutation({
		exerciseId: set.exerciseId,
		workoutId: set.workoutId,
	});

	const deleteSet = () =>
		removeMutation.mutateAsync({ setId: set.id }).catch(errorMsg("Failed to delete set"));

	const form = useForm<updateExerciseSet.FormType>({
		resolver: zodResolver(updateExerciseSet.form),
		defaultValues: {
			reps: set.reps,
			weight: set.weight,
			time: set.time,
			distance: set.distance,
			kcal: set.kcal,
			duplicates: set.duplicates,
		},
	});
	const duplicates = form.watch("duplicates");

	const updateData = () =>
		form.handleSubmit((values) => updateMutation.mutateAsync({ setId: set.id, ...values }))();

	const debouncedUpdateData = useCallback(debounce(updateData, 300), []);

	const minusSet = () => {
		if (duplicates > 1) {
			form.setValue("duplicates", duplicates - 1);
			updateData();
		} else {
			deleteSet();
		}
	};
	const plusSet = () => {
		form.setValue("duplicates", duplicates + 1);
		updateData();
	};

	const repsEnabled = hasExerciseField(exercise.modelExercise.enabledFields, "reps");
	const weightEnabled = hasExerciseField(exercise.modelExercise.enabledFields, "weight");
	const timeEnabled = hasExerciseField(exercise.modelExercise.enabledFields, "time");
	const distanceEnabled = hasExerciseField(exercise.modelExercise.enabledFields, "distance");
	const kcalEnabled = hasExerciseField(exercise.modelExercise.enabledFields, "kcal");

	const inputProps = {
		onChange: debouncedUpdateData,
		valueAsNumber: true,
	};

	return (
		<motion.div ref={isLast ? setRef : null} className="flex flex-col" {...animateHeightProps}>
			<Card
				variant={2}
				className="border-primary-800 mt-2 flex flex-col items-center gap-2 rounded-md p-2 py-2"
			>
				<div className="flex flex-col">
					<AnimatePresence initial={false} mode="wait">
						<motion.div {...animateHeightProps}>
							<div className="flex items-center justify-between gap-2 pb-2">
								<h3 className="mb-2">{duplicates}x</h3>

								<div className="flex gap-1">
									<Button onClick={plusSet} className="px-2">
										<Plus size={15} />
									</Button>
									<Button
										onClick={minusSet}
										className="px-2"
										intent={duplicates === 1 ? "danger" : "primary"}
									>
										<Minus size={15} />
									</Button>
								</div>
							</div>
						</motion.div>
					</AnimatePresence>

					{(repsEnabled || weightEnabled) && (
						<div className="flex gap-2">
							{repsEnabled && (
								<Input
									type="number"
									step=".01"
									min="0"
									label="Reps"
									invalid={!!form.formState.errors.reps?.message}
									{...form.register("reps", inputProps)}
								/>
							)}

							{weightEnabled && (
								<Input
									type="number"
									step=".01"
									label="(kg) Weight"
									invalid={!!form.formState.errors.weight?.message}
									{...form.register("weight", inputProps)}
								/>
							)}
						</div>
					)}

					{(timeEnabled || distanceEnabled) && (
						<div className="flex gap-2 pt-2">
							{timeEnabled && (
								<Input
									type="number"
									step=".01"
									min="0"
									label="Time"
									invalid={!!form.formState.errors.time?.message}
									{...form.register("time", inputProps)}
								/>
							)}

							{distanceEnabled && (
								<Input
									type="number"
									step=".01"
									min="0"
									label="(m) Distance"
									invalid={!!form.formState.errors.distance?.message}
									{...form.register("distance", inputProps)}
								/>
							)}
						</div>
					)}

					{kcalEnabled && (
						<div className="pt-2">
							<Input
								type="number"
								step=".01"
								label="Kcal"
								invalid={!!form.formState.errors.kcal?.message}
								{...form.register("kcal", inputProps)}
							/>
						</div>
					)}
				</div>
			</Card>
		</motion.div>
	);
};
