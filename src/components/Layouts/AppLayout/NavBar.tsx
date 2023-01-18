import { ButtonLink } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";
import { SettingsIcon } from "~components/Ui/Icons/SettingsIcon";

export function NavBar() {
	return (
		<nav className="fixed bottom-0 z-20 flex h-[4.8rem] w-full items-center justify-center p-3 backdrop:blur-sm sm:top-0 sm:bottom-[unset]">
			<Card className="flex h-full w-full max-w-page justify-between gap-2 overflow-hidden rounded-xl p-2 text-sm">
				<ButtonLink href="/app/sessions" className="w-full !p-2">
					Sessions
				</ButtonLink>
				<ButtonLink href="/app" className="w-full !p-2">
					Home
				</ButtonLink>
				<ButtonLink href="/app/workouts" className="w-full !p-2">
					Workouts
				</ButtonLink>
				<ButtonLink href="/app/settings" className="!p-2">
					<SettingsIcon />
				</ButtonLink>
			</Card>
		</nav>
	);
}
