import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Minus, Plus } from "tabler-icons-react";

import { Button } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";
import { Input } from "~components/Ui/Input";
import { animateHeightProps } from "~utils/animations";
import { errorMsg } from "~utils/errorMsg";
import type { RouterOutputs } from "~utils/trpc";
import {
	UpdateExerciseSetFormType,
	updateExerciseSetFormSchema,
} from "~validation/session/updateExerciseSet";

import { useDeleteSetMutation } from "./useDeleteSetMutation";
import { useUpdateSetMutation } from "./useUpdateSetMutation";

type Props = {
	set: NonNullable<RouterOutputs["session"]["getOne"]>["exercises"][number]["sets"][number];
	exercise: NonNullable<RouterOutputs["session"]["getOne"]>["exercises"][number];
	session: NonNullable<RouterOutputs["session"]["getOne"]>;
	setRef?: React.RefObject<HTMLDivElement>;
	isLast: boolean;
};

export function Set({ set, exercise, session, setRef, isLast }: Props) {
	const updateMutation = useUpdateSetMutation({
		exerciseId: exercise.id,
		sessionId: session.id,
	});
	const removeMutation = useDeleteSetMutation({
		exerciseId: exercise.id,
		sessionId: session.id,
	});

	function deleteSet() {
		return removeMutation
			.mutateAsync({
				setId: set.id,
				exerciseId: exercise.id,
				sessionId: session.id,
			})
			.catch(errorMsg("Failed to delete set"));
	}

	const form = useForm<UpdateExerciseSetFormType>({
		resolver: zodResolver(updateExerciseSetFormSchema),
		defaultValues: {
			reps: set.reps,
			weight: set.weight,
			assistedWeight: set.assistedWeight,
			time: set.time,
			distance: set.distance,
			kcal: set.kcal,
			count: set.count,
		},
	});
	const count = form.watch("count");

	function updateData() {
		return form.handleSubmit((values) =>
			updateMutation.mutateAsync({
				setId: set.id,
				exerciseId: exercise.id,
				sessionId: session.id,
				...values,
			})
		)();
	}

	const debouncedUpdateData = useCallback(debounce(updateData, 300), []);

	const minusSet = () => {
		if (count > 1) {
			form.setValue("count", count - 1);
			updateData();
		} else {
			deleteSet();
		}
	};
	const plusSet = () => {
		form.setValue("count", count + 1);
		updateData();
	};

	const fields = exercise.modelExercise.enabledFields;

	const repsEnabled = fields.includes("reps");
	const weightEnabled = fields.includes("weight");
	const timeEnabled = fields.includes("time");
	const distanceEnabled = fields.includes("distance");
	const kcalEnabled = fields.includes("kcal");
	const assistWeightEnabled = fields.includes("assistWeight");

	const inputProps = {
		onChange: debouncedUpdateData,
		valueAsNumber: true,
	};

	return (
		<motion.div ref={isLast ? setRef : null} className="flex flex-col" {...animateHeightProps}>
			<Card
				variant={2}
				className="mt-2 flex flex-col items-center gap-2 rounded-md border-primary-800 p-2 py-2"
			>
				<div className="flex flex-col">
					<AnimatePresence initial={false} mode="wait">
						<div className="flex flex-col">
							<div className="flex items-center justify-between gap-2 pb-2">
								<h3 className="mb-2">{count}x</h3>

								<div className="flex gap-1">
									<Button onClick={plusSet} className="px-2">
										<Plus size={15} />
									</Button>
									<Button
										onClick={minusSet}
										className="px-2"
										intent={count === 1 ? "danger" : "primary"}
									>
										<Minus size={15} />
									</Button>
								</div>
							</div>
						</div>
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

							{weightEnabled ? (
								<Input
									type="number"
									step=".01"
									label="(kg) Weight"
									invalid={!!form.formState.errors.weight?.message}
									{...form.register("weight", inputProps)}
								/>
							) : assistWeightEnabled ? (
								<Input
									type="number"
									step=".01"
									label="(kg) -Weight"
									invalid={!!form.formState.errors.weight?.message}
									{...form.register("assistedWeight", inputProps)}
								/>
							) : null}
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
}
