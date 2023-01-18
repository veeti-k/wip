import { motion } from "framer-motion";

import { Button } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";
import { RemoveIcon } from "~components/Ui/Icons/RemoveIcon";
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
				className="flex flex-col gap-2 rounded-xl p-3"
			>
				<div className="flex justify-between gap-2">
					<h2 className="text-xl font-medium">{workout.name}</h2>

					<Button className="z-10 !p-1" onClick={(e) => e.preventDefault()}>
						<RemoveIcon className="text-red-400" />
					</Button>
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
