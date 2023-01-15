import { TRPCError } from "@trpc/server";
import { ObjectId } from "mongodb";
import { z } from "zod";

import { DbExerciseSet, DbExerciseSetType } from "~server/db/types";
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
				_id: new ObjectId(input.sessionId),
				userId: ctx.auth.userId,
			});
		}),

	create: protectedProcedure
		.input(z.object({ name: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.mongo.sessions.insertOne({
				userId: ctx.auth.userId,
				name: input.name,
				startedAt: new Date(),
				exercises: [],
				bodyWeight: null,
				notes: null,
				stoppedAt: null,
			});
		}),

	edit: protectedProcedure.input(editSessionInputSchema).mutation(async ({ ctx, input }) => {
		const session = await ctx.prisma.session.findFirst({
			where: {
				id: input.sessionId,
				ownerId: ctx.auth.userId,
			},
		});

		if (!session) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Session not found",
			});
		}

		const updatedSession = await ctx.prisma.session.update({
			where: { id: session.id },
			data: {
				notes: input.notes,
				bodyWeight: input.bodyWeight,
			},
		});

		return updatedSession;
	}),

	editSessionInfo: protectedProcedure
		.input(editSessionInfoInputSchema)
		.mutation(async ({ ctx, input }) => {
			const session = await ctx.mongo.sessions.findOne({
				_id: new ObjectId(input.sessionId),
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
					_id: new ObjectId(input.sessionId),
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
					code: "BAD_REQUEST",
					message: "Could not update session",
				});
			}

			return updatedSession.value;
		}),

	finish: protectedProcedure
		.input(z.object({ sessionId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const session = await ctx.mongo.sessions.findOne({
				_id: new ObjectId(input.sessionId),
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
					_id: new ObjectId(input.sessionId),
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
			const existingSession = await ctx.prisma.session.findFirst({
				where: {
					id: input.sessionId,
					ownerId: ctx.auth.userId,
				},
			});

			if (!existingSession) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			await ctx.prisma.session.delete({
				where: { id: existingSession.id },
			});
		}),

	addExercise: protectedProcedure
		.input(z.object({ sessionId: z.string(), modelExerciseId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const modelExercise = await ctx.mongo.modelExercises.findOne({
				_id: new ObjectId(input.modelExerciseId),
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
					_id: new ObjectId(input.sessionId),
					userId: ctx.auth.userId,
				},
				{
					$push: {
						exercises: {
							_id: new ObjectId(),
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
				_id: new ObjectId(input.sessionId),
				userId: ctx.auth.userId,
			});

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const exercise = session.exercises.find(
				(exercise) => exercise._id.toString() === input.exerciseId
			);

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
					_id: new ObjectId(input.sessionId),
					userId: ctx.auth.userId,
					"exercises._id": new ObjectId(input.exerciseId),
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
				_id: new ObjectId(input.sessionId),
				userId: ctx.auth.userId,
			});

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const exercise = session.exercises.find(
				(exercise) => exercise._id.toString() === input.exerciseId
			);

			if (!exercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const response = await ctx.mongo.sessions.findOneAndUpdate(
				{
					_id: new ObjectId(input.sessionId),
					userId: ctx.auth.userId,
				},
				{ $pull: { exercises: { _id: new ObjectId(input.exerciseId) } } },
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
			const session = await ctx.mongo.sessions.findOne({
				_id: new ObjectId(input.sessionId),
				userId: ctx.auth.userId,
			});

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const exercise = session.exercises.find(
				(exercise) => exercise._id.toString() === input.exerciseId
			);

			if (!exercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const newSet: DbExerciseSet = {
				_id: new ObjectId(),
				type: DbExerciseSetType.Normal,
				duplicates: 1,
				weight: null,
				reps: null,
				assistedWeight: null,
				distance: null,
				kcal: null,
				time: null,
			};

			const updatedExercise = {
				...exercise,
				sets: [...exercise.sets, newSet],
			};

			const response = await ctx.mongo.sessions.findOneAndUpdate(
				{
					_id: new ObjectId(input.sessionId),
					userId: ctx.auth.userId,
					"exercises._id": new ObjectId(input.exerciseId),
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
				_id: new ObjectId(input.sessionId),
				userId: ctx.auth.userId,
			});

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const exercise = session.exercises.find(
				(exercise) => exercise._id.toString() === input.exerciseId
			);

			if (!exercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const set = exercise.sets.find((set) => set._id.toString() === input.setId);

			if (!set) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Set not found",
				});
			}

			const updatedSet = {
				...set,
				weight: input.weight,
				reps: input.reps,
				duplicates: input.duplicates,
			};

			const updatedExercise = {
				...exercise,
				sets: exercise.sets.map((set) =>
					set._id.toString() === input.setId ? updatedSet : set
				),
			};

			const response = await ctx.mongo.sessions.findOneAndUpdate(
				{
					_id: new ObjectId(input.sessionId),
					userId: ctx.auth.userId,
					"exercises._id": new ObjectId(input.exerciseId),
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
				_id: new ObjectId(input.sessionId),
				userId: ctx.auth.userId,
			});

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const exercise = session.exercises.find(
				(exercise) => exercise._id.toString() === input.exerciseId
			);

			if (!exercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const set = exercise.sets.find((set) => set._id.toString() === input.setId);

			if (!set) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Set not found",
				});
			}

			const updatedExercise = {
				...exercise,
				sets: exercise.sets.filter((set) => set._id.toString() !== input.setId),
			};

			const response = await ctx.mongo.sessions.findOneAndUpdate(
				{
					_id: new ObjectId(input.sessionId),
					userId: ctx.auth.userId,
					"exercises._id": new ObjectId(input.exerciseId),
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
