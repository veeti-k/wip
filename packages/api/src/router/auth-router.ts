import { protectedProcedure, router } from "../trpc.js";

export const authRouter = router({
	info: protectedProcedure.query(({ ctx }) => {
		return {
			userId: ctx.auth.userId,
			email: ctx.auth.email,
			isAdmin: ctx.auth.isAdmin,
		};
	}),
});
