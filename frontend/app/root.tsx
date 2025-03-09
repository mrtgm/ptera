import type { LinksFunction } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import "@fontsource/dotgothic16";
import "./base.css";

import "./tailwind.css";
import { GeneralErrorBoundary } from "./components/error-boundary";

//
export const links: LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="h-ful">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export const ErrorBoundary = GeneralErrorBoundary;

export default function App() {
	return <Outlet />;
}

export function HydrateFallback() {
	return <p>Loading...</p>;
}
