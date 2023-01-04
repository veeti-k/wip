import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc.js";

export const workoutRouter = router({
	getOnGoing: protectedProcedure.query(async ({ ctx }) => {
		const currentTime = new Date();

		return ctx.prisma.workout.findMany({
			where: {
				stoppedAt: null,
				createdAt: { lte: currentTime },
				ownerId: ctx.auth.userId,
			},
			include: { exercises: { include: { sets: true, modelExercise: true } } },
		});
	}),

	getAllPerMonth: protectedProcedure.query(async ({ ctx }) => {
		const workouts = await ctx.prisma.workout.findMany({
			where: {
				ownerId: ctx.auth.userId,
			},
			orderBy: {
				createdAt: "desc",
			},
			include: { exercises: { include: { sets: true, modelExercise: true } } },
		});

		const groupedWorkouts = workouts.reduce((acc, workout) => {
			const month = workout.createdAt.toLocaleString("default", { month: "long" });
			const year = workout.createdAt.getFullYear();

			const monthYear = `${month} ${year}`;

			if (!acc[monthYear]) {
				acc[monthYear] = [];
			}

			acc[monthYear]?.push(workout);

			return acc;
		}, {} as Record<string, typeof workouts>);

		return groupedWorkouts;
	}),

	getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		const workout = await ctx.prisma.workout.findFirst({
			where: {
				id: input.id,
				ownerId: ctx.auth.userId,
			},
			include: { exercises: { include: { sets: true, modelExercise: true } } },
		});

		return workout;
	}),

	createWorkout: protectedProcedure
		.input(z.object({ name: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const workout = await ctx.prisma.workout.create({
				data: {
					name: input.name,
					owner: { connect: { id: ctx.auth.userId } },
				},
				include: { exercises: { include: { sets: true, modelExercise: true } } },
			});

			return workout;
		}),

	updateWorkout: protectedProcedure
		.input(z.object({ workoutId: z.string(), notes: z.string().nullable() }))
		.mutation(async ({ ctx, input }) => {
			const workout = await ctx.prisma.workout.findFirst({
				where: {
					id: input.workoutId,
					ownerId: ctx.auth.userId,
				},
			});

			if (!workout) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Workout not found",
				});
			}

			await ctx.prisma.workout.update({
				where: { id: workout.id },
				data: { notes: input.notes },
			});
		}),

	finishWorkout: protectedProcedure
		.input(z.object({ workoutId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const workout = await ctx.prisma.workout.findFirst({
				where: {
					id: input.workoutId,
					ownerId: ctx.auth.userId,
				},
			});

			if (!workout) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Workout not found",
				});
			}

			const updatedWorkout = await ctx.prisma.workout.update({
				where: { id: workout.id },
				data: { stoppedAt: new Date() },
				include: { exercises: { include: { sets: true, modelExercise: true } } },
			});

			return updatedWorkout;
		}),

	deleteWorkout: protectedProcedure
		.input(z.object({ workoutId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const workout = await ctx.prisma.workout.findFirst({
				where: {
					id: input.workoutId,
					ownerId: ctx.auth.userId,
				},
			});

			if (!workout) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Workout not found",
				});
			}

			await ctx.prisma.workout.delete({
				where: { id: workout.id },
			});
		}),

	addExercise: protectedProcedure
		.input(z.object({ workoutId: z.string(), modelExerciseId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const workout = await ctx.prisma.workout.findFirst({
				where: {
					id: input.workoutId,
					ownerId: ctx.auth.userId,
				},
			});

			if (!workout) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Workout not found",
				});
			}

			const existingModelExercise = await ctx.prisma.modelExercise.findFirst({
				where: {
					id: input.modelExerciseId,
					ownerId: ctx.auth.userId,
				},
			});

			if (!existingModelExercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const updatedWorkout = await ctx.prisma.workout.update({
				where: { id: workout.id },
				data: {
					exercises: {
						create: {
							modelExercise: { connect: { id: existingModelExercise.id } },
							owner: { connect: { id: ctx.auth.userId } },
						},
					},
				},
				include: { exercises: { include: { sets: true, modelExercise: true } } },
			});

			return updatedWorkout;
		}),

	removeExercise: protectedProcedure
		.input(z.object({ workoutId: z.string(), exerciseId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const existingExercise = await ctx.prisma.exercise.findFirst({
				where: {
					id: input.exerciseId,
					workoutId: input.workoutId,
					ownerId: ctx.auth.userId,
				},
			});

			if (!existingExercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const updatedWorkout = await ctx.prisma.workout.update({
				where: { id: input.workoutId },
				data: { exercises: { delete: { id: existingExercise.id } } },
				include: { exercises: { include: { sets: true, modelExercise: true } } },
			});

			return updatedWorkout;
		}),

	addExerciseSet: protectedProcedure
		.input(z.object({ workoutId: z.string(), exerciseId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const workout = await ctx.prisma.workout.findFirst({
				where: {
					id: input.workoutId,
					ownerId: ctx.auth.userId,
				},
				include: { exercises: { select: { id: true } } },
			});

			if (!workout) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Workout not found",
				});
			}

			const exercise = workout.exercises.find((e) => e.id === input.exerciseId);

			if (!exercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const updatedWorkout = await ctx.prisma.workout.update({
				where: { id: workout.id },
				data: {
					exercises: {
						update: {
							where: { id: exercise.id },
							data: {
								sets: {
									create: {
										owner: { connect: { id: ctx.auth.userId } },
										workout: { connect: { id: workout.id } },
									},
								},
							},
						},
					},
				},
				include: { exercises: { include: { sets: true, modelExercise: true } } },
			});

			return updatedWorkout;
		}),

	updateExerciseSet: protectedProcedure
		.input(
			z.object({
				setId: z.string(),
				reps: z.number().nullable(),
				weight: z.number().nullable(),
				time: z.number().nullable(),
				distance: z.number().nullable(),
				kcal: z.number().nullable(),
				duplicates: z.number(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const existingSet = await ctx.prisma.set.findFirst({
				where: { id: input.setId, ownerId: ctx.auth.userId },
			});

			if (!existingSet) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Set not found",
				});
			}

			await ctx.prisma.set.update({
				where: { id: existingSet.id },
				data: {
					weight: input.weight,
					reps: input.reps,
					duplicates: input.duplicates,
				},
			});
		}),

	removeExerciseSet: protectedProcedure
		.input(z.object({ setId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const set = await ctx.prisma.set.findFirst({
				where: { id: input.setId, ownerId: ctx.auth.userId },
			});

			if (!set) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Set not found",
				});
			}

			await ctx.prisma.set.delete({ where: { id: set.id } });
		}),
});
