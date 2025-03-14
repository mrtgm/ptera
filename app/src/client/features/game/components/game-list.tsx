import { api } from "@/client/api";
import { GameCard } from "@/client/features/dashboard/components/game-card";
import { Pagination } from "@/client/features/game/components/pagination";
import { PAGINATION_CONFIG } from "@/client/features/game/constants";
import type { GetGamesRequest } from "@/schemas/games/dto";

import { Empty } from "./empty";

export default async function GameList({
	searchParams,
}: { searchParams: GetGamesRequest }) {
	const gamesResponse = await api.games.list(searchParams);

	if (
		!gamesResponse ||
		!gamesResponse.items ||
		gamesResponse.items.length === 0
	) {
		return <Empty />;
	}

	const totalPages = Math.ceil(
		gamesResponse.total / PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
	);

	return (
		<div>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{gamesResponse.items.map((game) => (
					<GameCard key={game.id} game={game} showAuthor />
				))}
			</div>

			{totalPages > 1 && (
				<Pagination totalPages={totalPages} searchParams={searchParams} />
			)}
		</div>
	);
}
