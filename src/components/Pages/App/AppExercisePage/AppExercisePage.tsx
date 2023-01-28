import { motion } from "framer-motion";
import { useRouter } from "next/router";

import { AppLayout } from "~components/Layouts/AppLayout/AppLayout";
import { Card } from "~components/Ui/Cards/Card";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { LoadingCard } from "~components/Ui/Cards/LoadingCard";
import { animateOpacityProps } from "~utils/animations";
import { trpc } from "~utils/trpc";

import { OneRepMaxes } from "./OneRepMaxes";

export function AppExercisePage() {
	const router = useRouter();
	const modelExerciseId = router.query["modelExerciseId"];

	const { data, isLoading, error } = trpc.exercise.getOne.useQuery({
		modelExerciseId:
			modelExerciseId && typeof modelExerciseId === "string" ? modelExerciseId : "",
	});

	return (
		<AppLayout title="Exercise">
			<h1 className="mb-5 text-2xl font-medium">Exercise</h1>

			{isLoading ? (
				<LoadingCard message="Getting exercise info..." />
			) : error ? (
				<ErrorCard message="Error getting exercise" />
			) : data.modelExercise ? (
				<div className="flex flex-col gap-4">
					<Card className="flex flex-col gap-2 p-3">
						<div className="flex flex-col justify-between gap-3 ">
							<h1 className="text-2xl">{data.modelExercise.name}</h1>
						</div>
					</Card>

					{!!data.hasSessions ? (
						<OneRepMaxes oneRepMaxes={data.oneRepMaxes} />
					) : (
						<Card
							as={motion.div}
							{...animateOpacityProps}
							className="px-3 py-5 text-center font-light"
						>
							No sessions
						</Card>
					)}
				</div>
			) : null}
		</AppLayout>
	);
}
