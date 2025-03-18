import "@fontsource/dotgothic16";
import "../../globals.css";

import { MainLayout } from "@/client/components/layout/main-layout";
import { AuthProvider } from "@/client/features/auth/providers/auth-provider";

export const metadata = {
  title: "Ptera",
  description:
    "Ptera は、オリジナルのビジュアルノベルやアドベンチャーゲームを作成するためのプラットフォームです。",
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "48x48",
        url: "/favicon-48x48.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/icon-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/icon-512x512.png",
      },
    ],
  },
};

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
