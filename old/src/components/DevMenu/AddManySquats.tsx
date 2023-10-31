import { Button } from "~components/Ui/Button";
import { trpc } from "~utils/trpc";

export function DevMenuAddManySquats() {
	const trpcCtx = trpc.useContext();

	const mutation = trpc.dev.addManySquats.useMutation({
		onSettled: () => trpcCtx.invalidate(),
	});

	return (
		<Button onClick={() => mutation.mutateAsync()} disabled={mutation.isLoading}>
			{mutation.isLoading ? "Adding..." : "Add many squats"}
		</Button>
	);
}
