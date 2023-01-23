import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { DbExerciseSet } from "~server/db/types";

import { protectedProcedure, router } from "../trpc";

export const exerciseRouter = router({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const sessions = await ctx.mongo.sessions
			.find({ userId: ctx.auth.userId })
			.sort({ createdAt: -1 })
			.toArray();

		const modelExercises = await ctx.mongo.modelExercises
			.find({ userId: ctx.auth.userId })
			.toArray();

		const exercises: Record<
			string,
			Record<
				string,
				{
					id: string;
					name: string;
					currentOneRepMax: {
						epley: number;
						brzycki: number;
						mayhew: number;
						oconner: number;
						wathen: number;
						lander: number;
					} | null;
					lastDoneAt: Date | null;
				}
			>
		> = {};

		sessions.forEach((s) =>
			s.exercises.map((e) => {
				exercises[e.modelExercise.categoryName] ??= {};

				if (!exercises[e.modelExercise.categoryName]![e.modelExercise.name]) {
					exercises[e.modelExercise.categoryName]![e.modelExercise.name] = {
						id: e.modelExercise.id,
						name: e.modelExercise.name,
						currentOneRepMax: getOneRepMax(e.sets),
						lastDoneAt: s.startedAt,
					};
				}
			})
		);

		modelExercises.forEach((m) => {
			exercises[m.categoryName] ??= {};

			if (!exercises[m.categoryName]![m.name]) {
				exercises[m.categoryName]![m.name] = {
					id: m.id,
					name: m.name,
					currentOneRepMax: null,
					lastDoneAt: null,
				};
			}
		});

		return exercises;
	}),

	getOne: protectedProcedure
		.input(z.object({ modelExerciseId: z.string() }))
		.query(async ({ ctx, input }) => {
			const modelExercise = await ctx.mongo.modelExercises.findOne({
				id: input.modelExerciseId,
				userId: ctx.auth.userId,
			});

			if (!modelExercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Model exercise not found",
				});
			}

			return modelExercise;
		}),
});

function getOneRepMax(sets: DbExerciseSet[]) {
	const maxSet = sets
		.filter((s) => s.weight !== null && s.reps !== null)
		.sort((a, b) => a.weight! - b.weight!)
		.pop() as
		| (DbExerciseSet & {
				weight: number;
				reps: number;
		  })
		| undefined;

	if (!maxSet) {
		return null;
	}

	return {
		epley: maxSet.weight * (1 + maxSet.reps / 30),
		brzycki: maxSet.weight / (1.0278 - 0.0278 * maxSet.reps),
		mayhew: (100 * maxSet.weight) / (52.2 + 41.9 * Math.E ** (-0.055 * maxSet.reps)),
		oconner: maxSet.weight * (1 + maxSet.reps / 40),
		wathen: (100 * maxSet.weight) / (48.8 + 53.8 * Math.E ** (-0.075 * maxSet.reps)),
		lander: (100 * maxSet.weight) / (101.3 - 2.67123 * maxSet.reps),
	};
}
