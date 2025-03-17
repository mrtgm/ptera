import { Card, CardContent } from "@/client/components/shadcn/card";
import { GameCard } from "@/client/features/dashboard/components/game-card";
import type { GameListResponse } from "@ptera/schema";
import { Gamepad2 } from "lucide-react";

export const UserGameList = ({
	games,
}: { games: GameListResponse[] | null }) => {
	if (!games || games.length === 0) {
		return (
			<Card>
				<CardContent className="py-8 text-center">
					<Gamepad2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
					<p className="text-muted-foreground">まだゲームを公開していません</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{games.map((game) => (
				<GameCard key={game.id} game={game} showAuthor={false} />
			))}
		</div>
	);
};
