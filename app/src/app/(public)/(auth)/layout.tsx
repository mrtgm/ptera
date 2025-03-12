import type { Metadata } from "next";
import { DotGothic16 } from "next/font/google";
import "../../globals.css";

export const metadata: Metadata = {
	title: "Ptera",
	description: "Ptera is a new way to create, share, and play stories.",
};

const dotGothic16 = DotGothic16({
	weight: "400",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className={`${dotGothic16.className}  antialiased`}>
				{children}
			</body>
		</html>
	);
}
