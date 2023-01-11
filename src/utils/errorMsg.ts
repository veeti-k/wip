import { toast } from "react-hot-toast";

export function errorMsg(msg: string) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (err: any) => toast.error(`${msg}: ${err?.message || "Unknown error"}`);
}
