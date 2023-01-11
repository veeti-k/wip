import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

import { AppLayout } from "~components/Layouts/AppLayout/AppLayout";
import { Button } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";
import { ErrorCard } from "~components/Ui/Cards/ErrorCard";
import { LoadingCard } from "~components/Ui/Cards/LoadingCard";
import { animateOpacityProps } from "~utils/animations";
import { trpc } from "~utils/trpc";

import { AddExerciseModal } from "./AddExercise/AddExercise";
import { AddExerciseProvider } from "./AddExercise/AddExerciseContext";
import { DeleteSession } from "./DeleteSession/DeleteSession";
import { EditSessionInfo } from "./EditSessionInfo/EditSessionInfo";
import { Exercise } from "./Exercise/Exercise";
import { FinishSession } from "./FinishWorkout/FinishWorkout";
import { Times } from "./Times/Times";
import { SessionInputs } from "./WorkoutInputs/WorkoutInputs";

export function AppSessionPage() {
	const router = useRouter();
	const sessionId = router.query["sessionId"];

	const {
		data: session,
		isLoading,
		error,
	} = trpc.session.getOne.useQuery({
		id: sessionId && typeof sessionId === "string" ? sessionId : "",
	});

	const inProgress = !!!session?.stoppedAt;
	const hasExercises = !!session?.exercises.length;

	return (
		<AppLayout title="Session">
			{isLoading ? (
				<LoadingCard message="Getting session info..." />
			) : error ? (
				<ErrorCard message="Error getting session" />
			) : session ? (
				<>
					<Card className="mb-4 flex flex-col gap-2 p-3">
						<div className="flex justify-between gap-3">
							<h1 className="text-2xl">{session.name}</h1>

							<EditSessionInfo session={session} />
						</div>

						<Times session={session} />
						<SessionInputs session={session} />
					</Card>

					<div className="flex flex-col gap-4">
						<Card className="flex flex-col gap-3 rounded-xl p-3">
							{inProgress && <FinishSession session={session} />}
							<Button>Save as a session</Button>
							<DeleteSession session={session} />
						</Card>
					</div>

					<div className="mt-4 flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<h1 className="text-xl font-light">Exercises</h1>

							<AnimatePresence initial={false} mode="popLayout">
								{hasExercises ? (
									session.exercises.map((exercise) => (
										<Exercise key={exercise.id} exercise={exercise} />
									))
								) : (
									<Card
										as={motion.div}
										key="no-exercises"
										className="flex items-center justify-center px-3 py-5 font-light"
										{...animateOpacityProps}
									>
										No exercises
									</Card>
								)}
							</AnimatePresence>

							<AddExerciseProvider sessionId={session.id}>
								<AddExerciseModal />
							</AddExerciseProvider>
						</div>
					</div>
				</>
			) : null}
		</AppLayout>
	);
}
