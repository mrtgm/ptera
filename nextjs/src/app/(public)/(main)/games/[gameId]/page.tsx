import { api } from "@/client/api";
import { Button } from "@/client/components/shadcn/button";
import { GameDetail } from "@/client/features/game/components/game-detail";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense, use } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    gameId: string;
  }>;
}) {
  const p = await params;
  if (!p.gameId) {
    return {
      title: "ゲーム詳細 | Ptera",
      description: "ゲーム詳細ページです。",
    };
  }
  const gameId = Number.parseInt(p.gameId, 10);
  const game = await api.games.getMetadata(gameId);
  return {
    title: `${game.name}の詳細 | Ptera`,
    description: `${game.name}の詳細ページです。`,
  };
}

export default function GameDetailPage({
  params,
}: {
  params: Promise<{
    gameId: string;
  }>;
}) {
  const p = use(params);
  const gameId = Number.parseInt(p.gameId, 10);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <Button variant="outline" size="sm" asChild className="mb-4">
        <Link href="/games">
          <ChevronLeft className="mr-2 h-4 w-4" />
          ゲーム一覧に戻る
        </Link>
      </Button>

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20 select-none">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              メタデータを読み込み中...
            </span>
          </div>
        }
      >
        <GameDetail gameId={gameId} />
      </Suspense>
    </div>
  );
}
