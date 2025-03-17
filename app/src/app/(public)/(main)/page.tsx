import { api } from "@/client/api";
import { Button } from "@/client/components/shadcn/button";
import { GameCard } from "@/client/features/dashboard/components/game-card";
import type { GameListResponse } from "@/schemas/games/dto";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

// export const dynamic = "force-dynamic";

export default async function HomePage() {
	const [newGamesResponse, popularGamesResponse] = await Promise.all([
		api.games.list({ limit: 4, offset: 0, sort: "createdAt", order: "desc" }),
		api.games.list({ limit: 4, offset: 0, sort: "playCount", order: "desc" }),
	]);

	const newGames = newGamesResponse?.items || [];
	const popularGames = popularGamesResponse?.items || [];

	return (
		<div>
			<section className="relative py-20 flex flex-col gap-3">
				<div className="container mx-auto px-4 text-center col-span-5">
					<p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto font-[DotGothic16]">
						Ptera はビジュアルノベルを
						<br />
						かんたんに作れて、
						<br />
						みんなと共有できるサービスです。
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							variant="ghost"
							className="text-lg font-bold hover:animate-text-blink"
							asChild
						>
							<Link href="/dashboard">&gt; ゲームを作る</Link>
						</Button>
						<Button
							size="lg"
							variant="ghost"
							className="text-lg font-bold hover:animate-text-blink"
							asChild
						>
							<Link href="/games">&gt; ゲームを探す</Link>
						</Button>
					</div>
				</div>
			</section>

			<section className="py-16 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl md:text-3xl font-bold flex items-center">
							<Clock className="h-6 w-6 mr-2 text-primary" />
							新着作品
						</h2>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/games?sort=createdAt">
								もっと見る <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>

					{newGames.length === 0 ? (
						<div className="text-center text-muted-foreground py-8">
							まだ作品がありません。最初の作品を投稿しましょう！
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{newGames.map((game: GameListResponse) => (
								<GameCard key={game.id} game={game} />
							))}
						</div>
					)}
				</div>
			</section>

			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl md:text-3xl font-bold flex items-center">
							<TrendingUp className="h-6 w-6 mr-2 text-primary" />
							人気作品
						</h2>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/games?sort=playCount">
								もっと見る <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>

					{popularGames.length === 0 ? (
						<div className="text-center text-muted-foreground py-8">
							まだ人気作品がありません。
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{popularGames.map((game: GameListResponse) => (
								<GameCard key={game.id} game={game} />
							))}
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
