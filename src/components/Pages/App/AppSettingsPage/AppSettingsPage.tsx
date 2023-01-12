import { signOut, useSession } from "next-auth/react";

import { AppLayout } from "~components/Layouts/AppLayout/AppLayout";
import { Button } from "~components/Ui/Button";
import { Card } from "~components/Ui/Cards/Card";

export function AppSettingsPage() {
	const { data } = useSession();

	return (
		<AppLayout title="Settings">
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-light">Settings</h1>

				<div className="flex flex-col gap-3">
					<Card className="flex flex-col gap-3 rounded-xl p-3 font-light">
						<h2>{data?.user?.email}</h2>
					</Card>

					<Button onClick={() => signOut()}>Logout</Button>
				</div>
			</div>
		</AppLayout>
	);
}
