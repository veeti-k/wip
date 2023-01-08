import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./context.js";

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape;
	},
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
	if (!ctx.auth) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Not authenticated",
		});
	}

	return next({
		ctx: { auth: ctx.auth },
	});
});

const isAdmin = t.middleware(async ({ ctx, next }) => {
	if (!ctx.auth?.isAdmin) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Forbidden",
		});
	}

	return next({
		ctx: { auth: ctx.auth },
	});
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAuthed).use(isAdmin);
