import { Button } from "~components/Ui/Button";
import { trpc } from "~utils/trpc";

export function DevMenuAddSession() {
	const trpcCtx = trpc.useContext();

	const mutation = trpc.dev.addSession.useMutation({
		onSettled: () => trpcCtx.invalidate(),
	});

	return (
		<Button onClick={() => mutation.mutateAsync()} disabled={mutation.isLoading}>
			{mutation.isLoading ? "Adding..." : "Add session"}
		</Button>
	);
}
