import { Button } from "~components/Ui/Button";
import { trpc } from "~utils/trpc";

export function DevMenuDeleteSessions() {
	const trpcCtx = trpc.useContext();

	const mutation = trpc.dev.deleteSessions.useMutation({
		onSettled: () => trpcCtx.invalidate(),
	});

	return (
		<Button onClick={() => mutation.mutateAsync()} disabled={mutation.isLoading}>
			{mutation.isLoading ? "Deleting..." : "Delete sessions"}
		</Button>
	);
}
