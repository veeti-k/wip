import * as Collapsible from "@radix-ui/react-collapsible";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { AnimatedChevron } from "~components/Ui/AnimatedChevron";
import { Button } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";
import { animateHeightProps } from "~utils/animations";
import type { RouterOutputs } from "~utils/trpc";

type Props = {
	category: RouterOutputs["modelExercise"]["getAll"][number];
	openCategoryName: string | null;
	setOpenCategoryName: (category: string | null) => void;
	allOpen: boolean;
	onClick: (modelExerciseId: string) => void;
};

export function ExerciseCategory({
	category,
	openCategoryName,
	setOpenCategoryName,
	allOpen,
	onClick,
}: Props) {
	const [isOpen, setIsOpen] = useState(openCategoryName === category.categoryName || allOpen);

	useEffect(() => {
		setIsOpen(openCategoryName === category.categoryName || allOpen);
	}, [openCategoryName, allOpen, category.categoryName]);

	return (
		<Collapsible.Root
			asChild
			open={isOpen}
			onClick={() =>
				allOpen
					? setIsOpen(!isOpen)
					: setOpenCategoryName(
							openCategoryName === category.categoryName
								? null
								: category.categoryName
					  )
			}
		>
			<Card variant={2} className="flex flex-col rounded-md p-3">
				<div className="flex items-center justify-between gap-2">
					<h3 className="text-lg font-semibold">{category.categoryName}</h3>

					<Collapsible.Trigger asChild>
						<Button className="!p-1">
							<AnimatedChevron open={isOpen} />
						</Button>
					</Collapsible.Trigger>
				</div>

				<Collapsible.Content forceMount>
					<AnimatePresence initial={false}>
						{isOpen && (
							<motion.div {...animateHeightProps} className="flex flex-col space-y-2">
								<div className="mt-1" />
								{category.modelExercises.map((modelExercise) => (
									<Button
										key={modelExercise.name}
										onClick={() => onClick(modelExercise.id)}
										className="!justify-start"
									>
										<h4>{modelExercise.name}</h4>
									</Button>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</Collapsible.Content>
			</Card>
		</Collapsible.Root>
	);
}
