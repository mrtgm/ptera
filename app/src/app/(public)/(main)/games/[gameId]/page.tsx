import { Button } from "@/client/components/shadcn/button";
import { GameDetail } from "@/client/features/game/components/game-detail";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense, use } from "react";

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
					<div className="flex items-center justify-center h-64">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<span className="ml-2 text-muted-foreground">
							ゲームを読み込み中...
						</span>
					</div>
				}
			>
				<GameDetail gameId={gameId} />
			</Suspense>
		</div>
	);
}
