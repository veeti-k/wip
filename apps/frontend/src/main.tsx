import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

import { AuthProvider } from "~Auth/Auth";
import { Toaster } from "~components/_shared/Toaster";
import { TRPCProvider } from "~trpcReact/trpcReact";

import "./styles.css";

const IndexPage = React.lazy(() =>
	import("~components/IndexPage").then((mod) => ({
		default: mod.IndexPage,
	}))
);

const App = React.lazy(() =>
	import("~components/App/App").then((mod) => ({
		default: mod.App,
	}))
);

const AppIndexPage = React.lazy(() =>
	import("~components/App/AppIndexPage/AppIndexPage").then((mod) => ({
		default: mod.AppIndexPage,
	}))
);

const AppSettingsPage = React.lazy(() =>
	import("~components/App/AppSettingsPage/AppSettingsPage").then((mod) => ({
		default: mod.AppSettingsPage,
	}))
);

const AppWorkoutPage = React.lazy(() =>
	import("~components/App/AppWorkoutPage/AppWorkoutPage").then((mod) => ({
		default: mod.AppWorkoutPage,
	}))
);

const Auth = React.lazy(() =>
	import("~components/Auth/Auth").then((mod) => ({
		default: mod.Auth,
	}))
);

const AuthIndexPage = React.lazy(() =>
	import("~components/Auth/AuthIndexPage").then((mod) => ({
		default: mod.AuthIndexPage,
	}))
);

const AuthLoginPage = React.lazy(() =>
	import("~components/Auth/AuthLoginPage").then((mod) => ({
		default: mod.AuthLoginPage,
	}))
);

const AppWorkoutsPage = React.lazy(() =>
	import("~components/App/AppWorkoutsPage/AppWorkoutsPage").then((mod) => ({
		default: mod.AppWorkoutsPage,
	}))
);

const router = createBrowserRouter([
	{
		path: "/",
		element: <IndexPage />,
	},
	{
		path: "/auth",
		element: <Auth />,
		children: [
			{
				path: "",
				element: <AuthIndexPage />,
			},
			{
				path: "login",
				element: <AuthLoginPage />,
			},
		],
	},

	{
		path: "/app",
		element: <App />,
		children: [
			{
				path: "",
				element: <AppIndexPage />,
			},
			{
				path: "settings",
				element: <AppSettingsPage />,
			},
			{
				path: "workouts/:workoutId",
				element: <AppWorkoutPage />,
			},
			{
				path: "workouts",
				element: <AppWorkoutsPage />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Toaster />

		<TRPCProvider>
			<ReactQueryDevtools />

			<AuthProvider>
				<Suspense>
					<RouterProvider router={router} />
				</Suspense>
			</AuthProvider>
		</TRPCProvider>
	</React.StrictMode>
);
