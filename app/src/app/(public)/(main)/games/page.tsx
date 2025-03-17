import { api } from "@/client/api";
import GameFilterBar from "@/client/features/game/components/game-filter-bar";
import GameList from "@/client/features/game/components/game-list";
import type { GetGamesRequest } from "@/schemas/games/dto";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

// export const dynamic = "force-dynamic";

export default async function GamesPage({
	searchParams,
}: {
	searchParams: Promise<GetGamesRequest>;
}) {
	const categories = (await api.games.getCategories()) ?? [];
	const params = await searchParams;

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold">ゲーム一覧</h1>
				<p className="text-muted-foreground mt-2">
					オリジナルのビジュアルノベルやアドベンチャーゲームを探索しよう
				</p>
			</div>

			<GameFilterBar initialSearchParams={params} categories={categories} />

			<Suspense
				fallback={
					<div className="flex justify-center items-center py-20">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<span className="ml-2 text-muted-foreground">
							ゲームを読み込み中...
						</span>
					</div>
				}
			>
				<GameList searchParams={params} />
			</Suspense>
		</div>
	);
}
