import { ButtonLink } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";

export function NavBar() {
	return (
		<nav className="fixed bottom-0 z-20 flex w-full items-center justify-center p-3 backdrop:blur-sm sm:top-0 sm:bottom-[unset]">
			<Card className="grid h-[3.5rem] w-full max-w-[280px] grid-cols-3 grid-rows-1 items-center justify-between gap-2 overflow-hidden rounded-xl p-2 text-sm">
				<ButtonLink href="/app/sessions">Sessions</ButtonLink>
				<ButtonLink href="/app">Home</ButtonLink>
				<ButtonLink href="/app/settings">Settings</ButtonLink>
			</Card>
		</nav>
	);
}
