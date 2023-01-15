import { TRPCError, initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { Session } from "next-auth";
import superjson from "superjson";

import { getServerAuthSession } from "~server/auth";
import clientPromise from "~server/db/db";

type CreateContextOptions = {
	auth: Session["user"] | null;
};

const createInnerTRPCContext = async ({ auth }: CreateContextOptions) => {
	return {
		auth,
		mongo: await clientPromise,
	};
};

export const createTRPCContext = async (props: CreateNextContextOptions) => {
	const session = await getServerAuthSession(props);

	return createInnerTRPCContext({ auth: session?.user });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
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

	return next();
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(isAuthed);
export const adminProcedure = protectedProcedure.use(isAdmin);
