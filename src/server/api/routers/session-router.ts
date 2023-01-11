import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { editSessionInputSchema } from "~validation/session/editSession";
import { editSessionInfoInputSchema } from "~validation/session/editSessionInfo";
import { updateExerciseInputSchema } from "~validation/session/updateExercise";
import { updateExerciseSetInputSchema } from "~validation/session/updateExerciseSet";

import { protectedProcedure, router } from "../trpc";

export const sessionRouter = router({
	getOnGoing: protectedProcedure.query(async ({ ctx }) => {
		const currentTime = new Date();

		return ctx.prisma.session.findMany({
			where: {
				stoppedAt: null,
				createdAt: { lte: currentTime },
				ownerId: ctx.auth.userId,
			},
			include: { exercises: { include: { sets: true, modelExercise: true } } },
		});
	}),

	getAllPerMonth: protectedProcedure.query(async ({ ctx }) => {
		const sessions = await ctx.prisma.session.findMany({
			where: { ownerId: ctx.auth.userId },
			orderBy: { createdAt: "desc" },
			include: { exercises: { include: { sets: true, modelExercise: true } } },
		});

		const groupedSessions = sessions.reduce<Record<string, typeof sessions>>((acc, session) => {
			const month = session.createdAt.toLocaleString("default", { month: "long" });
			const year = session.createdAt.getFullYear();

			const monthYear = `${month} ${year}`;

			if (!acc[monthYear]) {
				acc[monthYear] = [];
			}

			acc[monthYear]?.push(session);

			return acc;
		}, {});

		return groupedSessions;
	}),

	getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		const session = await ctx.prisma.session.findFirst({
			where: {
				id: input.id,
				ownerId: ctx.auth.userId,
			},
			include: { exercises: { include: { sets: true, modelExercise: true } } },
		});

		return session;
	}),

	createSession: protectedProcedure
		.input(z.object({ name: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const session = await ctx.prisma.session.create({
				data: {
					name: input.name,
					owner: { connect: { id: ctx.auth.userId } },
				},
			});

			return {
				...session,
				exercises: [],
			};
		}),

	editSession: protectedProcedure
		.input(editSessionInputSchema)
		.mutation(async ({ ctx, input }) => {
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
			console.log({ input });

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
					name: input.name,
					createdAt: input.createdAt,
					stoppedAt: input.stoppedAt,
				},
			});

			return updatedSession;
		}),

	finishSession: protectedProcedure
		.input(z.object({ sessionId: z.string() }))
		.mutation(async ({ ctx, input }) => {
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
				data: { stoppedAt: new Date() },
			});

			return updatedSession;
		}),

	deleteSession: protectedProcedure
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

			const existingModelExercise = await ctx.prisma.modelExercise.findFirst({
				where: {
					id: input.modelExerciseId,
					ownerId: ctx.auth.userId,
				},
			});

			if (!existingModelExercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Model exercise not found",
				});
			}

			const createdExercise = await ctx.prisma.exercise.create({
				data: {
					modelExercise: { connect: { id: existingModelExercise.id } },
					owner: { connect: { id: ctx.auth.userId } },
					session: { connect: { id: session.id } },
				},
			});

			return {
				...createdExercise,
				modelExercise: existingModelExercise,
			};
		}),

	updateExercise: protectedProcedure
		.input(updateExerciseInputSchema)
		.mutation(async ({ ctx, input }) => {
			const existingExercise = await ctx.prisma.exercise.findFirst({
				where: {
					id: input.exerciseId,
					sessionId: input.sessionId,
					ownerId: ctx.auth.userId,
				},
			});

			if (!existingExercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			await ctx.prisma.exercise.update({
				where: { id: existingExercise.id },
				data: { notes: input.notes },
			});
		}),

	deleteExercise: protectedProcedure
		.input(z.object({ sessionId: z.string(), exerciseId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const existingExercise = await ctx.prisma.exercise.findFirst({
				where: {
					id: input.exerciseId,
					sessionId: input.sessionId,
					ownerId: ctx.auth.userId,
				},
			});

			if (!existingExercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			await ctx.prisma.exercise.delete({
				where: { id: existingExercise.id },
			});
		}),

	addExerciseSet: protectedProcedure
		.input(z.object({ sessionId: z.string(), exerciseId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const session = await ctx.prisma.session.findFirst({
				where: {
					id: input.sessionId,
					ownerId: ctx.auth.userId,
				},
				include: { exercises: { select: { id: true } } },
			});

			if (!session) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Session not found",
				});
			}

			const exercise = session.exercises.find((e) => e.id === input.exerciseId);

			if (!exercise) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Exercise not found",
				});
			}

			const createdSet = await ctx.prisma.set.create({
				data: {
					owner: { connect: { id: ctx.auth.userId } },
					session: { connect: { id: session.id } },
					exercise: { connect: { id: exercise.id } },
				},
			});

			return createdSet;
		}),

	updateExerciseSet: protectedProcedure
		.input(updateExerciseSetInputSchema)
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

	deleteExerciseSet: protectedProcedure
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
