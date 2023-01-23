import { authRouter } from "./routers/auth-router";
import { devRouter } from "./routers/dev-router";
import { exerciseRouter } from "./routers/exercise-router";
import { modelExerciseRouter } from "./routers/model-exercise-router";
import { sessionRouter } from "./routers/session-router";
import { workoutRouter } from "./routers/workout-router";
import { router } from "./trpc";

export const appRouter = router({
	auth: authRouter,
	session: sessionRouter,
	modelExercise: modelExerciseRouter,
	dev: devRouter,
	workout: workoutRouter,
	exercise: exerciseRouter,
});

export type AppRouter = typeof appRouter;
