import { TRPCError } from "@trpc/server";

import { uuid } from "~server/serverUtils/uuid";

import { devProcedure, router } from "../trpc";

export const devRouter = router({
	addSession: devProcedure.mutation(async ({ ctx }) => {
		const modelExercises = await ctx.mongo.modelExercises
			.find({
				userId: ctx.auth.userId,
			})
			.toArray();

		if (!modelExercises.length) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "No model exercises found",
			});
		}

		await ctx.mongo.sessions.insertOne({
			userId: ctx.auth.userId,
			id: uuid(),
			name: "Dev session",
			bodyWeight: null,
			notes: null,
			startedAt: new Date(),
			stoppedAt: null,
			exercises: modelExercises.slice(0, 5).map((modelExercise, i) => ({
				userId: ctx.auth.userId,
				id: uuid(),
				notes: null,
				modelExercise: modelExercise,
				sets: [
					{
						id: uuid(),
						assistedWeight: null,
						count: i * 2,
						distance: null,
						kcal: null,
						time: null,
						type: 1,
						weight: i * 5,
						reps: i * 3,
					},
				],
			})),
		});
	}),
});
