"use client";

import type { Metadata } from "next";
import "@fontsource/dotgothic16";
import "../../../../globals.css";
import { NavigationGuardProvider } from "next-navigation-guard";

// export const metadata: Metadata = {
// 	title: "Ptera",
// 	description: "Ptera is a new way to create, share, and play stories.",
// };

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body>
				<NavigationGuardProvider>{children}</NavigationGuardProvider>
			</body>
		</html>
	);
}
