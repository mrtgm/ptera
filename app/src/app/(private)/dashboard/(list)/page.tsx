"use client";

import type { GameMetaData } from "@/client/schema";
import { useEffect, useState } from "react";
import { useStore } from "~/client/stores";

import { Button } from "~/client/components/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "~/client/components/shadcn/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/client/components/shadcn/tabs";

import { createGame as createDomainGame } from "@/schemas/games/domain/game";
// lucide icons
import { Gamepad2, Plus } from "lucide-react";
import CreateGameDialog from "~/client/features/dashboard/components/create-game-dialog";
import { GameCard } from "~/client/features/dashboard/components/game-card";

// Dummy game data
const dummyGames: GameMetaData[] = [
	{
		id: 0,
		name: "青い鳥を探して",
		userId: 0,
		username: "user-0",
		avatarUrl: "https://placehold.co/32x32/3b82f6/ffffff?text=U",
		description:
			"幸せを探す少年の旅路を描いた物語。プレイヤーの選択によって異なる結末へと導かれる。",
		coverImageUrl:
			"https://placehold.co/400x225/3b82f6/ffffff?text=青い鳥を探して",
		releaseDate: "170844480000",
		schemaVersion: "1.0",
		status: "published",
		createdAt: "1708444800000",
		updatedAt: "1709913600000",
		playCount: 253,
		likeCount: 42,
		categoryIds: [0, 1],
	},
];

export default function GamesPage() {
	// const isAuthenticated = useStore((state) => state.isAuthenticated);
	// const currentUser = useStore((state) => state.currentUser);

	const [currentUser, setCurrentUser] = useState({
		id: 0,
		name: "ゲームクリエイター",
		bio: "ゲームクリエイターです。",
		avatarUrl: "https://i.pravatar.cc/300",
	});

	const [isAuthenticated, setIsAuthenticated] = useState(true);

	const [userGames, setUserGames] = useState<GameMetaData[]>(dummyGames);
	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const [activeTab, setActiveTab] = useState("all");

	useEffect(() => {
		setUserGames(dummyGames);
	}, []);

	const createGame = async (name: string, description: string) => {
		const newGame = createDomainGame({
			userId: currentUser.id,
			name,
			description,
		});

		setUserGames((prev) => [
			...prev,
			{
				...newGame,
				username: currentUser.name,
				avatarUrl: currentUser.avatarUrl,
			},
		]);
		return newGame.id;
	};

	const deleteGame = async (gameId: number) => {
		setUserGames((prev) => prev.filter((game) => game.id !== gameId));
	};

	const publishGame = async (gameId: number, shouldPublish: boolean) => {
		setUserGames((prev) =>
			prev.map((game) =>
				game.id === gameId
					? {
							...game,
							status: shouldPublish ? "published" : "draft",
							isPublic: shouldPublish,
							updatedAt: Date.now().toString(),
						}
					: game,
			),
		);
	};

	const handlePublishToggle = async (
		gameId: number,
		currentStatus: "draft" | "published" | "archived",
	) => {
		//TODO:実装
		const shouldPublish = currentStatus !== "published";
		await publishGame(gameId, shouldPublish);
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
		<div className="space-y-6">
			<div className="flex justify-between items-center">
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

						<CreateGameDialog
							open={openCreateDialog}
							onOpenChange={setOpenCreateDialog}
							onCreate={createGame}
						/>
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
			</div>
		</div>
	);

	function renderGameList(games: typeof userGames) {
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
						onPublishToggle={handlePublishToggle}
						onDelete={deleteGame}
					/>
				))}
			</div>
		);
	}
}
