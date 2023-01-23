import * as RadixCollapsible from "@radix-ui/react-collapsible";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { AppLayout } from "~components/Layouts/AppLayout/AppLayout";
import { AnimatedChevron } from "~components/Ui/AnimatedChevron";
import { Button } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { LoadingCard } from "~components/Ui/Cards/LoadingCard";
import { Collapsible } from "~components/Ui/Collapsible";
import { Input } from "~components/Ui/Input";
import { ShowDate } from "~components/Ui/ShowDate";
import { animateOpacityProps } from "~utils/animations";
import { trpc } from "~utils/trpc";

export function AppExercisesPage() {
	const { data, isLoading, error } = trpc.exercise.getAll.useQuery();

	const [openCategory, setOpenCategory] = useState<string | null>(null);

	return (
		<AppLayout title="Exercises">
			<div className="mb-5 flex flex-col gap-5">
				<h1 className="text-2xl font-medium">Exercises</h1>

				<Input placeholder="Search exercises..." />
			</div>

			<AnimatePresence initial={false}>
				{isLoading ? (
					<LoadingCard message="Getting exercises..." />
				) : error ? (
					<ErrorCard message="Error getting exercises" />
				) : Object.entries(data).length ? (
					<motion.div {...animateOpacityProps}>
						<AnimatePresence initial={false}>
							{Object.entries(data).map(([categoryName, exercises]) => (
								<Collapsible
									isOpen={openCategory === categoryName}
									trigger={
										<div className="flex justify-between gap-2">
											<h2>{categoryName}</h2>

											<RadixCollapsible.Trigger asChild>
												<Button
													className="!p-1"
													onClick={() =>
														setOpenCategory((prev) =>
															prev === categoryName
																? null
																: categoryName
														)
													}
												>
													<AnimatedChevron
														open={openCategory === categoryName}
													/>
												</Button>
											</RadixCollapsible.Trigger>
										</div>
									}
								>
									<Card className="flex flex-col gap-3 p-2">
										{Object.entries(exercises).map(
											([_exerciseName, exercise]) => (
												<Card variant={2} className="mb-2 p-2">
													<h2 className="text-xl">{exercise.name}</h2>

													<Card variant={3} className="mt-3 p-2">
														<h3 className="pb-1">Latest one rep max</h3>

														<span className="font-light">
															{(exercise.currentOneRepMax
																? exercise.currentOneRepMax?.brzycki
																: 0
															)?.toFixed(2)}{" "}
															kg
														</span>
													</Card>

													<Card variant={3} className="mt-2 p-2">
														<h3 className="pb-1">Last done at</h3>

														<span className="font-light">
															{exercise.lastDoneAt ? (
																<ShowDate
																	date={exercise.lastDoneAt}
																/>
															) : (
																"Never"
															)}
														</span>
													</Card>
												</Card>
											)
										)}
									</Card>
								</Collapsible>
							))}
						</AnimatePresence>
					</motion.div>
				) : (
					<Card
						as={motion.div}
						{...animateOpacityProps}
						className="px-3 py-5 text-center font-light"
					>
						No exercises
					</Card>
				)}
			</AnimatePresence>
		</AppLayout>
	);
}
