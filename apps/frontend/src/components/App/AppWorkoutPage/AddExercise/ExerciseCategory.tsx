import * as Collapsible from "@radix-ui/react-collapsible";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { RouterOutputs } from "@gym/api";

import { AnimatedChevron } from "~components/_ui/AnimatedChevron";
import { Button } from "~components/_ui/Button";
import { Card } from "~components/_ui/Card";
import { animateHeightProps } from "~utils/animations";

type Props = {
	category: RouterOutputs["exercise"]["getModelExercises"][number];
	openCategoryId: string | null;
	setOpenCategoryId: (category: string | null) => void;
	allOpen: boolean;
	onClick: (modelExerciseId: string) => void;
};

export const ExerciseCategory = ({
	category,
	openCategoryId,
	setOpenCategoryId,
	allOpen,
	onClick,
}: Props) => {
	const [isOpen, setIsOpen] = useState(openCategoryId === category.id || allOpen);

	useEffect(() => {
		setIsOpen(openCategoryId === category.id || allOpen);
	}, [openCategoryId, allOpen]);

	return (
		<Collapsible.Root
			asChild
			open={isOpen}
			onClick={() =>
				allOpen
					? setIsOpen(!isOpen)
					: setOpenCategoryId(openCategoryId === category.id ? null : category.id)
			}
		>
			<Card variant={2} className="flex flex-col rounded-md p-3">
				<div className="flex items-center justify-between gap-2">
					<h3 className="text-lg font-semibold">{category.name}</h3>

					<Collapsible.Trigger asChild>
						<Button className="!p-1">
							<AnimatedChevron open={isOpen} />
						</Button>
					</Collapsible.Trigger>
				</div>

				<Collapsible.Content asChild forceMount>
					<AnimatePresence initial={false}>
						{isOpen && (
							<motion.div {...animateHeightProps} className="flex flex-col space-y-2">
								<div className="mt-1" />
								{category.modelExercises.map((modelExercise) => (
									<Button
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
};
