import { AppLayout } from "~components/Layouts/AppLayout/AppLayout";

import { OnGoingSession } from "./OnGoingSessions";
import { StartSession } from "./StartSession";

export function AppIndexPage() {
	return (
		<AppLayout title="Home">
			<div className="flex flex-col gap-3">
				<OnGoingSession />
				<StartSession />
			</div>
		</AppLayout>
	);
}
