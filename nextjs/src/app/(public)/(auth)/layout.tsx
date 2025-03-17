import type { Metadata } from "next";
import "../../globals.css";
import "@fontsource/dotgothic16";
import { AuthProvider } from "@/client/features/auth/providers/auth-provider";

export const metadata: Metadata = {
  title: "Ptera",
  description: "Ptera is a new way to create, share, and play stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
