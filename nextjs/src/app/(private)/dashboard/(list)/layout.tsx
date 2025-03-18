import { SideBar } from "@/client/features/game/components/side-bar";
import { Header } from "~/client/features/dashboard/components/header";
import "../../../globals.css";
import "@fontsource/dotgothic16";
import { AuthProvider } from "@/client/features/auth/providers/auth-provider";

export const metadata = {
  title: "Ptera",
  description:
    "Ptera は、オリジナルのビジュアルノベルやアドベンチャーゲームを作成するためのプラットフォームです。",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon.ico" },
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

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 flex">
              <SideBar />

              <div className="flex-1 p-6 md:p-8">
                <div className="mb-8">{children}</div>
              </div>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
