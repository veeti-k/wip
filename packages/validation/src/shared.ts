import { z } from "zod";

export const tagLabelSchema = z
	.string()
	.min(1, { message: "Required" })
	.min(3, { message: "Too short!" })
	.max(25, { message: "Too long!" });
export const usernameSchema = z
	.string()
	.min(1, { message: "Required" })
	.min(3, { message: "Too short!" })
	.max(25, { message: "Too long!" });

export const FIVE_MINUTES = 5 * 60;
export const TWO_HOURS = 2 * 60 * 60;
