import { guard } from "@/client/features/auth/guard";
import { DashboardGamesContent } from "@/client/features/dashboard/components/game-list-wrapper";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default async function DashboardGamesPage() {
  await guard();

  return (
    <div className="space-y-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">読み込み中...</span>
          </div>
        }
      >
        <DashboardGamesContent />
      </Suspense>
    </div>
  );
}
