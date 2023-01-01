import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "../trpc.js";
import { authRouter } from "./auth-router.js";
import { exerciseRouter } from "./exercise-router.js";
import { workoutRouter } from "./workout-router.js";

export const appRouter = router({
	auth: authRouter,
	exercise: exerciseRouter,
	workout: workoutRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
