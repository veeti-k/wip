import { authRouter } from "./routers/auth-router";
import { exerciseRouter } from "./routers/exercise-router";
import { sessionRouter } from "./routers/session-router";
import { router } from "./trpc";

export const appRouter = router({
	auth: authRouter,
	session: sessionRouter,
	exercise: exerciseRouter,
});

export type AppRouter = typeof appRouter;
