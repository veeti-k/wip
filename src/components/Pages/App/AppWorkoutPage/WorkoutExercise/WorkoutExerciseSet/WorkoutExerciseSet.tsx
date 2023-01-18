import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Minus, Plus } from "tabler-icons-react";

import { Button } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";
import { Input } from "~components/Ui/Input";
import { animateHeightProps, animateListItemProps } from "~utils/animations";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";
import {
	UpdateWorkoutExerciseSetFormType,
	updateWorkoutExerciseSetFormSchema,
} from "~validation/workout/updateWorkoutExerciseSet";

import { useDeleteWorkoutSetMutation } from "./useDeleteWorkoutSetMutation";
import { useUpdateWorkoutSetMutation } from "./useUpdateWorkoutSetMutation";

type Props = {
	set: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number]["sets"][number];
	exercise: NonNullable<RouterOutputs["workout"]["getOne"]>["exercises"][number];
	workout: NonNullable<RouterOutputs["workout"]["getOne"]>;
	setRef?: React.RefObject<HTMLDivElement>;
	isLast: boolean;
};

export function WorkoutExerciseSet({ set, exercise, workout, setRef, isLast }: Props) {
	const updateMutation = useUpdateWorkoutSetMutation();
	const deleteMutation = useDeleteWorkoutSetMutation();

	function deleteSet() {
		return deleteMutation
			.mutateAsync({
				setId: set.id,
				exerciseId: exercise.id,
				workoutId: workout.id,
			})
			.catch(errorMsg("Failed to delete set"));
	}

	const form = useForm<UpdateWorkoutExerciseSetFormType>({
		resolver: zodResolver(updateWorkoutExerciseSetFormSchema),
		defaultValues: {
			reps: set.reps,
			count: set.count,
		},
	});
	const count = form.watch("count");

	function updateData() {
		return form.handleSubmit((values) =>
			updateMutation
				.mutateAsync({
					setId: set.id,
					exerciseId: exercise.id,
					workoutId: workout.id,
					count: values.count,
					reps: values.reps,
				})
				.catch(errorMsg("Failed to update set"))
		);
	}

	const debouncedUpdateData = useCallback(debounce(updateData, 300), []);

	function minusSet() {
		if (count > 1) {
			form.setValue("count", count - 1);
			updateData();
		} else {
			deleteSet();
		}
	}

	function plusSet() {
		form.setValue("count", count + 1);
		updateData();
	}

	const fields = exercise.modelExercise.enabledFields;

	const repsEnabled = fields.includes("reps");

	const inputProps = {
		onChange: debouncedUpdateData,
		valueAsNumber: true,
	};

	return (
		<motion.div
			ref={isLast ? setRef : null}
			className="flex flex-col"
			{...animateListItemProps}
		>
			<Card
				variant={2}
				className="mt-2 flex flex-col items-center gap-2 rounded-md border-primary-800 p-2 py-2"
			>
				<div className="flex w-full flex-col">
					<div className="flex items-center justify-between gap-2 pb-2">
						<h3 className="mb-2">{count}x</h3>

						<div className="flex gap-1">
							<Button
								onClick={plusSet}
								disabled={updateMutation.isLoading || deleteMutation.isLoading}
								className="px-2"
							>
								<Plus size={15} />
							</Button>
							<Button
								onClick={minusSet}
								disabled={updateMutation.isLoading || deleteMutation.isLoading}
								className="px-2"
								intent={count === 1 ? "danger" : "primary"}
							>
								<Minus size={15} />
							</Button>
						</div>
					</div>

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
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
