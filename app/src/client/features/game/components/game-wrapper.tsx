"use client";

import { api } from "@/client/api";
import { Card, CardContent } from "@/client/components/shadcn/card";
import GamePlayer from "@/client/features/player/player";
import { EventManager } from "@/client/features/player/utils/event";
import type { Game, GameMetaData } from "@/client/schema";
import type { GameResources } from "@/schemas/assets/domain/resoucres";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const GamePlayerWrapper = ({
	gameId,
	initialGameData,
}: {
	gameId: number;
	initialGameData?: Game;
}) => {
	const [isGameLoading, setIsGameLoading] = useState(true);
	const [gameData, setGameData] = useState<Game | undefined>(initialGameData);
	const [gameResources, setGameResources] = useState<GameResources | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const [eventManager] = useState(() => new EventManager());

	// ゲームとリソースの読み込み
	useEffect(() => {
		const loadGameData = async () => {
			try {
				setIsGameLoading(true);
				setError(null);

				const gameResponse = await api.games.get(gameId);
				const assetsResponse = await api.games.getAssets(gameId);

				if (gameResponse && assetsResponse) {
					setGameData(gameResponse as Game);
					setGameResources(assetsResponse as GameResources);

					await api.games.incrementPlayCount(gameId);
				} else {
					throw new Error("ゲームデータの取得に失敗しました");
				}
			} catch (err) {
				console.error("Failed to load game data:", err);
				setError("ゲームデータの読み込みに失敗しました");
			} finally {
				setIsGameLoading(false);
			}
		};

		loadGameData();
	}, [gameId]);

	return (
		<Card>
			<CardContent className="p-0 aspect-video relative">
				{isGameLoading ? (
					<div className="absolute inset-0 flex items-center justify-center bg-muted/50">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<span className="ml-2">ゲームを読み込み中...</span>
					</div>
				) : error ? (
					<div className="absolute inset-0 flex items-center justify-center bg-muted/50">
						<p className="text-destructive">{error}</p>
					</div>
				) : gameData && gameResources ? (
					<GamePlayer
						game={gameData}
						resources={gameResources}
						eventManager={eventManager}
					/>
				) : (
					<div className="absolute inset-0 flex items-center justify-center bg-muted/50">
						<p className="text-muted-foreground">ゲームデータがありません</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
