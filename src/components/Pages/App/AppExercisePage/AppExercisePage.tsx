import { useRouter } from "next/router";

import { AppLayout } from "~components/Layouts/AppLayout/AppLayout";
import { Card } from "~components/Ui/Cards/Card";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { LoadingCard } from "~components/Ui/Cards/LoadingCard";
import { trpc } from "~utils/trpc";

import { OneRepMaxes } from "./OneRepMaxes";

export function AppExercisePage() {
	const router = useRouter();
	const modelExerciseIdQuery = router.query["modelExerciseId"];

	const modelExerciseId =
		modelExerciseIdQuery && typeof modelExerciseIdQuery === "string"
			? modelExerciseIdQuery
			: "";

	const { data, isLoading, error } = trpc.exercise.getOne.useQuery({
		modelExerciseId,
	});

	const oneRepMaxes = OneRepMaxes({ modelExerciseId });

	return (
		<AppLayout title="Exercise">
			<h1 className="mb-5 text-2xl font-medium">Exercise</h1>

			{isLoading ? (
				<LoadingCard message="Getting exercise info..." />
			) : error ? (
				<ErrorCard message="Error getting exercise" />
			) : data ? (
				<div className="flex flex-col gap-4">
					<Card className="flex flex-col gap-2 p-3">
						<div className="flex flex-col justify-between gap-3 ">
							<h1 className="text-2xl">{data.name}</h1>

							{oneRepMaxes.latestOneRepMax}
						</div>
					</Card>

					{oneRepMaxes.oneRepMaxChart}
				</div>
			) : null}
		</AppLayout>
	);
}
