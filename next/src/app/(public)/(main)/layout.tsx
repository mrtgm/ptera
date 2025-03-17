import "@fontsource/dotgothic16";
import "../../globals.css";

import { MainLayout } from "@/client/components/layout/main-layout";
import { AuthProvider } from "@/client/features/auth/providers/auth-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<body>
				<AuthProvider>
					<MainLayout>{children}</MainLayout>
				</AuthProvider>
			</body>
		</html>
	);
}
