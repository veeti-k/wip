import { toast } from "react-hot-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorMsg = (msg: string) => (err: any) =>
	toast.error(`${msg}: ${err?.message || "Unknown error"}`);
