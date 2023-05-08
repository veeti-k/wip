import { TRPCError } from "@trpc/server";
import { subMonths } from "date-fns";
import { z } from "zod";

import { DbExercise, DbExerciseSet, DbExerciseSetType, DbSession } from "~server/db/types";
import { getOneRepMax } from "~server/serverUtils/getOneRepMax";
import { uuid } from "~server/serverUtils/uuid";
import { editSessionInputSchema } from "~validation/session/editSession";
import { editSessionInfoInputSchema } from "~validation/session/editSessionInfo";
import { updateExerciseInputSchema } from "~validation/session/updateExercise";
import { updateExerciseSetInputSchema } from "~validation/session/updateExerciseSet";

import { protectedProcedure, router } from "../trpc";

export const sessionRouter = router({
	getOnGoing: protectedProcedure.query(async ({ ctx }) => {
		const currentTime = new Date();

		return ctx.mongo.sessions
			.find({
				userId: ctx.auth.userId,
				stoppedAt: null,
				startedAt: { $lte: currentTime },
			})
			.toArray();
	}),

	getAllPerMonth: protectedProcedure.query(async ({ ctx }) => {
		const sessions = await ctx.mongo.sessions
			.find({ userId: ctx.auth.userId })
			.sort({ startedAt: -1 })
			.toArray();

		const groupedSessions = sessions.reduce<Record<string, typeof sessions>>((acc, session) => {
			const month = session.startedAt.toLocaleString("default", { month: "long" });
			const year = session.startedAt.getFullYear();

			const monthYear = `${month} ${year}`;

			if (!acc[monthYear]) {
				acc[monthYear] = [];
			}

			acc[monthYear]?.push(session);

			return acc;
		}, {});

		return groupedSessions;
	}),

	getOne: protectedProcedure
		.input(z.object({ sessionId: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.mongo.sessions.findOne({
				id: input.sessionId,
				userId: ctx.auth.userId,
			});
		}),

	create: protectedProcedure
		.input(z.object({ name: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.mongo.sessions.insertOne({
				id: uuid(),
				saved: false,
				userId: ctx.auth.userId,
				name: input.name,
				startedAt: new Date(),
				exercises: [],
				bodyWeight: null,
				notes: null,
				stoppedAt: null,
			});
		}),

	createFromWorkout: protectedProcedure
		.input(z.object({ workoutId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const workout = await ctx.mongo.workouts.findOne({
				id: input.workoutId,
				userId: ctx.auth.userId,
			});

			if (!workout) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Workout not found",
				});
			}

			const exercises: DbExercise[] = workout.exercises.map((exercise) => {
				const sets: DbExerciseSet[] = exercise.sets.map((set) => ({
					id: uuid(),
					reps: set.reps,
					type: set.type,
					count: set.count,
					assistedWeight: null,
					distance: null,
					kcal: null,
					time: null,
					weight: null,
					oneRepMax: null,
				}));

				return {
					id: uuid(),
					modelExercise: exercise.modelExercise,
					notes: null,
					userId: ctx.auth.userId,
					sets,
				};
			});

			const session: DbSession = {
				id: uuid(),
				name: workout.name,
				userId: ctx.auth.userId,
				exercises,
				startedAt: new Date(),
				stoppedAt: null,
				saved: false,
				bodyWeight: null,
				notes: null,
			};

			const insertResult = await ctx.mongo.sessions.insertOne(session);

			return { _id: insertResult.insertedId, ...session };
		}),

	edit: protectedProcedure.input(editSessionInputSchema).mutation(async ({ ctx, input }) => {
		const session = await ctx.mongo.sessions.findOne({
			id: input.sessionId,
			userId: ctx.auth.userId,
		});

		if (!session) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Session not found",
			});
		}

		const updatedSession = await ctx.mongo.sessions.findOneAndUpdate(
			{
				id: input.sessionId,
				userId: ctx.auth.userId,
			},
			{
				$set: {
					bodyWeight: input.bodyWeight,
					notes: input.notes,
				},
			},
			{ returnDocument: "after" }
		);

		if (!updatedSession.ok) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Db error",
			});
		}

		return updatedSession.value;
	}),

	editSessionInfo: protectedProcedure
		.input(editSessionInfoInputSchema)
		.mutation(async ({ ctx, input }) => {
			const session = await ctx.mongo.sessions.findOne({
				id: input.sessionId,
				userId: ctx.auth.userId,
			});

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const updatedSession = await ctx.mongo.sessions.findOneAndUpdate(
				{
					id: input.sessionId,
					userId: ctx.auth.userId,
				},
				{
					$set: {
						name: input.name,
						startedAt: input.startedAt,
						stoppedAt: input.stoppedAt,
					},
				},
				{ returnDocument: "after" }
			);

			if (!updatedSession.ok) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Db error",
				});
			}

			return updatedSession.value;
		}),

	finish: protectedProcedure
		.input(z.object({ sessionId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const session = await ctx.mongo.sessions.findOne({
				id: input.sessionId,
				userId: ctx.auth.userId,
			});

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const updatedSession = await ctx.mongo.sessions.findOneAndUpdate(
				{
					id: input.sessionId,
					userId: ctx.auth.userId,
				},
				{ $set: { stoppedAt: new Date() } },
				{ returnDocument: "after" }
			);

			if (!updatedSession.ok) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Db error",
				});
			}

			return updatedSession.value;
		}),

	delete: protectedProcedure
		.input(z.object({ sessionId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.mongo.sessions.deleteOne({
				id: input.sessionId,
				userId: ctx.auth.userId,
			});
		}),

	addExercise: protectedProcedure
		.input(z.object({ sessionId: z.string(), modelExerciseId: z.string() }))
		.mutation(async ({ ctx, input }) => {
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

			const response = await ctx.mongo.sessions.findOneAndUpdate(
				{
					id: input.sessionId,
					userId: ctx.auth.userId,
				},
				{
					$push: {
						exercises: {
							id: uuid(),
							userId: ctx.auth.userId,
							modelExercise,
							sets: [],
							notes: null,
						},
					},
				},
				{ returnDocument: "after" }
			);

			if (!response.ok) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Could not add exercise",
				});
			}

			return response.value;
		}),

	updateExercise: protectedProcedure
		.input(updateExerciseInputSchema)
		.mutation(async ({ ctx, input }) => {
			const session = await ctx.mongo.sessions.findOne({
				id: input.sessionId,
				userId: ctx.auth.userId,
			});

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const exercise = session.exercises.find((exercise) => exercise.id === input.exerciseId);

			if (!exercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const updatedExercise = {
				...exercise,
				notes: input.notes,
			};

			const response = await ctx.mongo.sessions.findOneAndUpdate(
				{
					id: input.sessionId,
					userId: ctx.auth.userId,
					"exercises.id": input.exerciseId,
				},
				{ $set: { "exercises.$": updatedExercise } },
				{ returnDocument: "after" }
			);

			if (!response.ok) {
				console.log(
					`Failed to update exercise for ${ctx.auth.userId}: ${JSON.stringify(
						response.lastErrorObject,
						null,
						2
					)}`
				);

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Db error",
				});
			}

			return response.value;
		}),

	deleteExercise: protectedProcedure
		.input(z.object({ sessionId: z.string(), exerciseId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const session = await ctx.mongo.sessions.findOne({
				id: input.sessionId,
				userId: ctx.auth.userId,
			});

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const exercise = session.exercises.find((exercise) => exercise.id === input.exerciseId);

			if (!exercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const response = await ctx.mongo.sessions.findOneAndUpdate(
				{
					id: input.sessionId,
					userId: ctx.auth.userId,
				},
				{ $pull: { exercises: { id: input.exerciseId } } },
				{ returnDocument: "after" }
			);

			if (!response.ok) {
				console.log(
					`Failed to delete exercise for ${ctx.auth.userId}: ${JSON.stringify(
						response.lastErrorObject,
						null,
						2
					)}`
				);

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Db error",
				});
			}

			return response.value;
		}),

	addExerciseSet: protectedProcedure
		.input(z.object({ sessionId: z.string(), exerciseId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const sessions = await ctx.mongo.sessions
				.find({
					userId: ctx.auth.userId,
					startedAt: { $gte: subMonths(new Date(), 2) },
				})
				.sort({ startedAt: -1 })
				.toArray();

			const session = sessions.find((session) => session.id === input.sessionId);

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const exercise = session.exercises.find((exercise) => exercise.id === input.exerciseId);

			if (!exercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const lastExercise = sessions
				.flatMap((session) => session.exercises)
				.find((e) => e.modelExercise.name === exercise.modelExercise.name);

			const newSetIndex = exercise.sets.length;
			// TODO: Should be the last set of the same type, when multiple set types are supported
			const lastSet = lastExercise?.sets.at(newSetIndex) ?? lastExercise?.sets.at(-1);

			const lastSetIsInSameExercise = lastSet && lastExercise?.id === exercise.id;

			const newSet: DbExerciseSet = {
				id: uuid(),
				type: DbExerciseSetType.Normal,
				count: 1,
				weight: lastSetIsInSameExercise ? null : lastSet?.weight ?? null,
				reps: lastSet?.reps ?? null,
				assistedWeight: lastSetIsInSameExercise ? null : lastSet?.assistedWeight ?? null,
				distance: lastSetIsInSameExercise ? null : lastSet?.distance ?? null,
				kcal: lastSetIsInSameExercise ? null : lastSet?.kcal ?? null,
				time: lastSetIsInSameExercise ? null : lastSet?.time ?? null,
				oneRepMax: null,
			};

			newSet.oneRepMax = getOneRepMax(newSet);

			const updatedExercise = {
				...exercise,
				sets: [...exercise.sets, newSet],
			};

			const response = await ctx.mongo.sessions.findOneAndUpdate(
				{
					id: input.sessionId,
					userId: ctx.auth.userId,
					"exercises.id": input.exerciseId,
				},
				{ $set: { "exercises.$": updatedExercise } },
				{ returnDocument: "after" }
			);

			if (!response.ok) {
				console.log(
					`Failed to add exercise set for ${ctx.auth.userId}: ${JSON.stringify(
						response.lastErrorObject,
						null,
						2
					)}`
				);

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Db error",
				});
			}

			return response.value;
		}),

	updateExerciseSet: protectedProcedure
		.input(updateExerciseSetInputSchema)
		.mutation(async ({ ctx, input }) => {
			const session = await ctx.mongo.sessions.findOne({
				id: input.sessionId,
				userId: ctx.auth.userId,
			});

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const exercise = session.exercises.find((exercise) => exercise.id === input.exerciseId);

			if (!exercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const set = exercise.sets.find((set) => set.id === input.setId);

			if (!set) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Set not found",
				});
			}

			const updatedSet: DbExerciseSet = {
				...set,
				weight: input.weight,
				reps: input.reps,
				count: input.count,
				oneRepMax: null,
			};

			updatedSet.oneRepMax = getOneRepMax(updatedSet);

			const updatedExercise = {
				...exercise,
				sets: exercise.sets.map((set) => (set.id === input.setId ? updatedSet : set)),
			};

			const response = await ctx.mongo.sessions.findOneAndUpdate(
				{
					id: input.sessionId,
					userId: ctx.auth.userId,
					"exercises.id": input.exerciseId,
				},
				{ $set: { "exercises.$": updatedExercise } },
				{ returnDocument: "after" }
			);

			if (!response.ok) {
				console.log(
					`Failed to update exercise set for ${ctx.auth.userId}: ${JSON.stringify(
						response.lastErrorObject,
						null,
						2
					)}`
				);

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Db error",
				});
			}

			return response.value;
		}),

	deleteExerciseSet: protectedProcedure
		.input(
			z.object({
				setId: z.string(),
				sessionId: z.string(),
				exerciseId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const session = await ctx.mongo.sessions.findOne({
				id: input.sessionId,
				userId: ctx.auth.userId,
			});

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const exercise = session.exercises.find((exercise) => exercise.id === input.exerciseId);

			if (!exercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const set = exercise.sets.find((set) => set.id === input.setId);

			if (!set) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Set not found",
				});
			}

			const updatedExercise = {
				...exercise,
				sets: exercise.sets.filter((set) => set.id !== input.setId),
			};

			const response = await ctx.mongo.sessions.findOneAndUpdate(
				{
					id: input.sessionId,
					userId: ctx.auth.userId,
					"exercises.id": input.exerciseId,
				},
				{ $set: { "exercises.$": updatedExercise } },
				{ returnDocument: "after" }
			);

			if (!response.ok) {
				console.log(
					`Failed to delete exercise set for ${ctx.auth.userId}: ${JSON.stringify(
						response.lastErrorObject,
						null,
						2
					)}`
				);

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Db error",
				});
			}

			return response.value;
		}),
});
