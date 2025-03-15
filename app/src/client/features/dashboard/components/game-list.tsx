"use client";

import { api } from "@/client/api";
import { Button } from "@/client/components/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/client/components/shadcn/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/client/components/shadcn/tabs";
import CreateGameDialog from "@/client/features/dashboard/components/create-game-dialog";
import { GameCard } from "@/client/features/dashboard/components/game-card";
import { performUpdate } from "@/client/utils/optimistic-update";
import type { GameListResponse } from "@/schemas/games/dto";
import { Gamepad2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PublishStatusDialog } from "./publish-confirm-dialog";

export const DashboardGamesList = ({
	userGames: initialGames,
}: {
	userGames: GameListResponse[];
}) => {
	const router = useRouter();
	const [userGames, setUserGames] = useState<GameListResponse[]>(initialGames);
	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const [activeTab, setActiveTab] = useState("all");

	const [publishDialogOpen, setPublishDialogOpen] = useState(false);
	const [selectedGame, setSelectedGame] = useState<GameListResponse | null>(
		null,
	);

	const createGame = async (name: string, description: string) => {
		const res = await performUpdate({
			api: () =>
				api.games.create({
					name,
					description,
				}),
			onSuccess: (newGame) => {
				if (newGame) {
					setUserGames((prev) => [newGame, ...prev]);
					router.refresh();
				}
			},
		});

		return res?.id;
	};

	const deleteGame = async (gameId: number) => {
		try {
			await api.games.delete(gameId);

			setUserGames((prev) => prev.filter((game) => game.id !== gameId));
			router.refresh();

			return true;
		} catch (err) {
			console.error("Failed to delete game:", err);
			return false;
		}
	};

	const handlePublishToggleRequest = (game: GameListResponse) => {
		setSelectedGame(game);
		setPublishDialogOpen(true);
	};

	const handlePublishToggle = async () => {
		if (!selectedGame) return;

		const gameId = selectedGame.id;
		const currentStatus = selectedGame.status;
		const shouldPublish = currentStatus !== "published";
		const previousGame = userGames.find((game) => game.id === gameId);

		if (!previousGame) {
			throw new Error("Game not found");
		}

		await performUpdate({
			api: () =>
				api.games.updateStatus(gameId, {
					status: shouldPublish ? "published" : "draft",
				}),
			optimisticUpdate: () => {
				setUserGames((prev) =>
					prev.map((game) =>
						game.id === gameId
							? {
									...game,
									status: shouldPublish ? "published" : "draft",
									updatedAt: new Date().toISOString(),
								}
							: game,
					),
				);
			},
			rollback: () => {
				setUserGames((prev) =>
					prev.map((game) => (game.id === gameId ? previousGame : game)),
				);
			},
		});
	};

	const filteredGames =
		activeTab === "all"
			? userGames
			: userGames.filter((game) =>
					activeTab === "published"
						? game.status === "published"
						: game.status === "draft",
				);

	return (
		<>
			<div className="flex items-center mb-4">
				<h1 className="text-2xl font-bold tracking-tight">ゲーム一覧 </h1>
			</div>
			<Tabs
				defaultValue="all"
				className="w-full"
				value={activeTab}
				onValueChange={setActiveTab}
			>
				<div className="flex justify-between items-center">
					<TabsList>
						<TabsTrigger value="all">すべて</TabsTrigger>
						<TabsTrigger value="published">公開中</TabsTrigger>
						<TabsTrigger value="draft">下書き</TabsTrigger>
					</TabsList>

					<Button variant="default" onClick={() => setOpenCreateDialog(true)}>
						<Plus className="mr-2 h-4 w-4" /> ゲームを作成
					</Button>
				</div>

				<TabsContent value="all" className="mt-6">
					{renderGameList(filteredGames)}
				</TabsContent>

				<TabsContent value="published" className="mt-6">
					{renderGameList(filteredGames)}
				</TabsContent>

				<TabsContent value="draft" className="mt-6">
					{renderGameList(filteredGames)}
				</TabsContent>
			</Tabs>

			<CreateGameDialog
				open={openCreateDialog}
				onOpenChange={setOpenCreateDialog}
				onCreate={createGame}
			/>

			{selectedGame && (
				<PublishStatusDialog
					open={publishDialogOpen}
					onOpenChange={setPublishDialogOpen}
					onConfirm={handlePublishToggle}
					gameTitle={selectedGame.name}
					currentStatus={selectedGame.status}
				/>
			)}
		</>
	);

	function renderGameList(games: GameListResponse[]) {
		if (games.length === 0) {
			return (
				<Card>
					<CardContent className="pt-6 pb-10 text-center">
						<div className="mb-4 flex justify-center">
							<div className="rounded-full bg-muted p-3">
								<Gamepad2 className="h-6 w-6" />
							</div>
						</div>
						<CardTitle className="mb-2">ゲームが見つかりません</CardTitle>
						<CardDescription>
							{activeTab === "all"
								? "まだゲームを作成していません。最初のゲームを作成しましょう。"
								: activeTab === "published"
									? "公開中のゲームはありません。下書きを公開してプレイヤーに提供しましょう。"
									: "下書き中のゲームはありません。新しいゲームを作成しましょう。"}
						</CardDescription>
						<Button className="mt-6" onClick={() => setOpenCreateDialog(true)}>
							<Plus className="mr-2 h-4 w-4" /> ゲームを作成
						</Button>
					</CardContent>
				</Card>
			);
		}

		return (
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{games.map((game) => (
					<GameCard
						key={game.id}
						game={game}
						showEdit
						showAuthor={false}
						onPublishToggle={() => handlePublishToggleRequest(game)}
						onDelete={deleteGame}
					/>
				))}
			</div>
		);
	}
};
