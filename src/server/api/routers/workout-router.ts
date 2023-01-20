import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { uuid } from "~server/serverUtils/uuid";
import { editWorkoutInfoInputSchema } from "~validation/workout/editWorkoutInfo";
import { updateWorkoutExerciseSetInputSchema } from "~validation/workout/updateWorkoutExerciseSet";

import { protectedProcedure, router } from "../trpc";

export const workoutRouter = router({
	create: protectedProcedure
		.input(z.object({ sessionId: z.string(), share: z.boolean() }))
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

			if (!session.stoppedAt) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not finished",
				});
			}

			if (session.saved) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session already saved",
				});
			}

			const workoutId = uuid();

			await ctx.mongo.workouts.insertOne({
				id: workoutId,
				userId: ctx.auth.userId,
				shared: input.share,
				createdAt: new Date(),
				name: session.name,
				exercises: session.exercises.map((exercise) => ({
					id: uuid(),
					modelExercise: exercise.modelExercise,
					sets: exercise.sets.map((set) => ({
						id: uuid(),
						type: set.type,
						count: set.count,
						reps: set.reps,
					})),
				})),
			});

			const updateResult = await ctx.mongo.sessions.findOneAndUpdate(
				{ id: input.sessionId },
				{ $set: { saved: true } },
				{ returnDocument: "after" }
			);

			if (!updateResult.ok) {
				console.log(
					`Failed to session exercise for ${ctx.auth.userId}: ${JSON.stringify(
						updateResult.lastErrorObject,
						null,
						2
					)}`
				);

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Db error",
				});
			}

			return { createdWorkoutId: workoutId, updatedSession: updateResult.value };
		}),

	getAll: protectedProcedure.query(async ({ ctx, input }) => {
		return ctx.mongo.workouts.find({ userId: ctx.auth.userId }).toArray();
	}),

	getOne: protectedProcedure
		.input(z.object({ workoutId: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.mongo.workouts.findOne({
				id: input.workoutId,
				userId: ctx.auth.userId,
			});
		}),

	delete: protectedProcedure
		.input(z.object({ workoutId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.mongo.workouts.deleteOne({
				id: input.workoutId,
				userId: ctx.auth.userId,
			});
		}),

	editInfo: protectedProcedure
		.input(editWorkoutInfoInputSchema)
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

			const response = await ctx.mongo.workouts.findOneAndUpdate(
				{
					id: input.workoutId,
					userId: ctx.auth.userId,
				},
				{ $set: { name: input.name } },
				{ returnDocument: "after" }
			);

			if (!response.ok) {
				console.log(
					`Failed to edit workout info for (workout ${input.workoutId}) ${
						ctx.auth.userId
					}: ${JSON.stringify(response.lastErrorObject, null, 2)}`
				);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to edit workout info",
				});
			}

			return response.value;
		}),

	addExercise: protectedProcedure
		.input(z.object({ workoutId: z.string(), modelExerciseId: z.string() }))
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

			const modelExercise = await ctx.mongo.modelExercises.findOne({
				id: input.modelExerciseId,
			});

			if (!modelExercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Model exercise not found",
				});
			}

			const response = await ctx.mongo.workouts.findOneAndUpdate(
				{
					id: input.workoutId,
					userId: ctx.auth.userId,
				},
				{
					$push: {
						exercises: {
							id: uuid(),
							modelExercise,
							sets: [],
						},
					},
				},
				{ returnDocument: "after" }
			);

			if (!response.ok) {
				console.log(
					`Failed to add exercise for (workout ${input.workoutId}) ${
						ctx.auth.userId
					}: ${JSON.stringify(response.lastErrorObject, null, 2)}`
				);

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Db error",
				});
			}

			return response.value;
		}),

	deleteExercise: protectedProcedure
		.input(z.object({ workoutId: z.string(), exerciseId: z.string() }))
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

			const exercise = workout.exercises.find((exercise) => exercise.id === input.exerciseId);

			if (!exercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const response = await ctx.mongo.workouts.findOneAndUpdate(
				{
					id: input.workoutId,
					userId: ctx.auth.userId,
				},
				{ $pull: { exercises: { id: input.exerciseId } } },
				{ returnDocument: "after" }
			);

			if (!response.ok) {
				console.log(
					`Failed to delete exercise for (workout ${input.workoutId}) ${
						ctx.auth.userId
					}: ${JSON.stringify(response.lastErrorObject, null, 2)}`
				);

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Db error",
				});
			}

			return response.value;
		}),

	addExerciseSet: protectedProcedure
		.input(z.object({ workoutId: z.string(), exerciseId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.mongo.workouts.findOneAndUpdate(
				{
					id: input.workoutId,
					userId: ctx.auth.userId,
					"exercises.id": input.exerciseId,
				},
				{
					$push: {
						"exercises.$.sets": {
							id: uuid(),
							count: 1,
							weight: 0,
							reps: 0,
						},
					},
				},
				{ returnDocument: "after" }
			);

			if (!response.ok) {
				console.log(
					`Failed to add set for (workout ${input.workoutId}) ${
						ctx.auth.userId
					}: ${JSON.stringify(response.lastErrorObject, null, 2)}`
				);

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Db error",
				});
			}

			return response.value;
		}),

	updateExerciseSet: protectedProcedure
		.input(updateWorkoutExerciseSetInputSchema)
		.mutation(async ({ ctx, input }) => {
			const session = await ctx.mongo.workouts.findOne({
				id: input.workoutId,
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

			const updatedSet = {
				...set,
				reps: input.reps,
				count: input.count,
			};

			const updatedExercise = {
				...exercise,
				sets: exercise.sets.map((set) => (set.id === input.setId ? updatedSet : set)),
			};

			const response = await ctx.mongo.workouts.findOneAndUpdate(
				{
					id: input.workoutId,
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
		.input(z.object({ workoutId: z.string(), exerciseId: z.string(), setId: z.string() }))
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

			const exercise = workout.exercises.find((exercise) => exercise.id === input.exerciseId);

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

			const response = await ctx.mongo.workouts.findOneAndUpdate(
				{
					id: input.workoutId,
					userId: ctx.auth.userId,
					"exercises.id": input.exerciseId,
				},
				{ $pull: { "exercises.$.sets": { id: input.setId } } },
				{ returnDocument: "after" }
			);

			if (!response.ok) {
				console.log(
					`Failed to delete set for (workout ${input.workoutId}) ${
						ctx.auth.userId
					}: ${JSON.stringify(response.lastErrorObject, null, 2)}`
				);

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Db error",
				});
			}

			return response.value;
		}),
});
