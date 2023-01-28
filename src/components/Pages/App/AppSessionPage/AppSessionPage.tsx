import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

import { AppLayout } from "~components/Layouts/AppLayout/AppLayout";
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
import { SaveAsAWorkout } from "./SaveAsAWorkout/SaveAsAWorkout";
import { SessionInputs } from "./SessionInputs/SessionInputs";
import { Times } from "./Times/Times";

export function AppSessionPage() {
	const router = useRouter();
	const sessionId = router.query["sessionId"];

	const {
		data: session,
		isLoading,
		error,
	} = trpc.session.getOne.useQuery({
		sessionId: sessionId && typeof sessionId === "string" ? sessionId : "",
	});

	const inProgress = !!!session?.stoppedAt;
	const hasExercises = !!session?.exercises.length;

	return (
		<AppLayout title="Session">
			<h1 className="mb-5 text-2xl font-medium">Session</h1>

			{isLoading ? (
				<LoadingCard message="Getting session info..." />
			) : error ? (
				<ErrorCard message="Error getting session" />
			) : session ? (
				<div className="flex flex-col gap-4">
					<Card className="flex flex-col gap-2 p-3">
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
							{!inProgress && <SaveAsAWorkout session={session} />}
							<DeleteSession session={session} />
						</Card>
					</div>

					<div className="flex flex-col">
						<h1 className="mb-2 text-xl font-light">Exercises</h1>

						<AnimatePresence initial={false}>
							{hasExercises ? (
								session.exercises.map((exercise) => (
									<Exercise
										key={exercise.id}
										session={session}
										exercise={exercise}
									/>
								))
							) : (
								<Card
									as={motion.div}
									key="no-exercises"
									className="mb-3 flex items-center justify-center px-3 py-5 font-light"
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
			) : null}
		</AppLayout>
	);
}
