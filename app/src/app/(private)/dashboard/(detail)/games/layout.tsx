import "@fontsource/dotgothic16";
import "../../../../globals.css";
import { NavigationGuardProvider } from "next-navigation-guard";

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
