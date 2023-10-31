import { type DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		signout?: boolean;
		user?: {
			userId: string;
			isAdmin: boolean;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		isAdmin: boolean;
		signout: boolean;
		dbUserId: string;
	}
}
