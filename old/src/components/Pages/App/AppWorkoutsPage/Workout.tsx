import { motion } from "framer-motion";

import { Card } from "~components/Ui/Cards/Card";
import { NextLink } from "~components/Ui/Link";
import { animateListItemProps } from "~utils/animations";
import type { RouterOutputs } from "~utils/trpc";

type Props = {
	workout: RouterOutputs["workout"]["getAll"][number];
};

export function Workout({ workout }: Props) {
	return (
		<motion.div {...animateListItemProps}>
			<Card
				as={NextLink}
				href={`/app/workouts/${workout.id}`}
				className="mb-3 flex flex-col gap-2 rounded-xl p-3"
			>
				<div className="flex justify-between gap-2">
					<h2 className="text-xl font-medium">{workout.name}</h2>
				</div>

				<div className="flex flex-col">
					{workout.exercises.map((exercise) => {
						const amountOfSets = exercise.sets.reduce((acc, set) => acc + set.count, 0);

						return (
							<div className="flex flex-col gap-1" key={exercise.id}>
								<span className="max-w-[200px] truncate text-sm font-light">
									{amountOfSets}x {exercise.modelExercise.name}
								</span>
							</div>
						);
					})}
				</div>
			</Card>
		</motion.div>
	);
}
