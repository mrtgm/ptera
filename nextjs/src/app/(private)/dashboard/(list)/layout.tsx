import { SideBar } from "@/client/features/game/components/side-bar";
import { Header } from "~/client/features/dashboard/components/header";
import "../../../globals.css";
import "@fontsource/dotgothic16";
import { AuthProvider } from "@/client/features/auth/providers/auth-provider";

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
