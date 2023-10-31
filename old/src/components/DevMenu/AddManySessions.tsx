import { Button } from "~components/Ui/Button";
import { trpc } from "~utils/trpc";

export function DevMenuAddManySessions() {
	const trpcCtx = trpc.useContext();

	const mutation = trpc.dev.addManySessions.useMutation({
		onSettled: () => trpcCtx.invalidate(),
	});

	return (
		<Button onClick={() => mutation.mutateAsync()} disabled={mutation.isLoading}>
			{mutation.isLoading ? "Adding..." : "Add many sessions"}
		</Button>
	);
}
