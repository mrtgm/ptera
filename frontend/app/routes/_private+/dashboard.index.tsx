import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { GameMetaData } from "~/schema";
import { useStore } from "~/stores";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "~/components/shadcn/alert-dialog";
import { Badge } from "~/components/shadcn/badge";
import { Button } from "~/components/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/shadcn/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/shadcn/dropdown-menu";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/shadcn/tabs";

// lucide icons
import {
	Edit,
	Eye,
	Gamepad2,
	Globe,
	Lock,
	MoreVertical,
	Plus,
	Trash2,
} from "lucide-react";
import CreateGameDialog from "~/features/dashboard/components/create-game-dialog";

// Dummy game data
const dummyGames: GameMetaData[] = [
	{
		id: "game-1",
		title: "青い鳥を探して",
		author: "user-1",
		description:
			"幸せを探す少年の旅路を描いた物語。プレイヤーの選択によって異なる結末へと導かれる。",
		coverImageUrl:
			"https://placehold.co/400x225/3b82f6/ffffff?text=青い鳥を探して",
		schemaVersion: "1.0",
		status: "published",
	},
	{
		id: "game-2",
		title: "迷宮の魔術師",
		author: "user-1",
		description:
			"古代の迷宮に閉じ込められた魔術師となり、謎を解いて脱出を目指す。複数のエンディングと隠しルートがある。",
		coverImageUrl:
			"https://placehold.co/400x225/a855f7/ffffff?text=迷宮の魔術師",
		schemaVersion: "1.0",
		status: "published",
	},
	{
		id: "game-3",
		title: "星の王子様",
		author: "user-1",
		description:
			"未完成の作品です。小惑星から来た不思議な少年との出会いを描く物語。",
		schemaVersion: "1.0",
		status: "draft",
	},
	{
		id: "game-4",
		title: "海底都市アトランティス",
		author: "user-1",
		description:
			"失われた伝説の都市アトランティスを探索する冒険ゲーム。水中での謎解きや選択肢によって物語が分岐する。",
		coverImageUrl:
			"https://placehold.co/400x225/10b981/ffffff?text=アトランティス",
		schemaVersion: "1.0",
		status: "draft",
	},
];

export default function GamesPage() {
	const isAuthenticated = useStore((state) => state.isAuthenticated);
	const currentUser = useStore((state) => state.currentUser);

	const [userGames, setUserGames] = useState<GameMetaData[]>(dummyGames);
	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const [activeTab, setActiveTab] = useState("all");

	useEffect(() => {
		setUserGames(dummyGames);
	}, []);

	const createGame = async (title: string, description: string) => {
		const newGame: GameMetaData = {
			id: `game-${Date.now()}`,
			title,
			author: currentUser?.id || "unknown",
			description,
			schemaVersion: "1.0",
			status: "draft",
		};

		setUserGames((prev) => [...prev, newGame]);
		return newGame.id;
	};

	const deleteGame = async (gameId: string) => {
		setUserGames((prev) => prev.filter((game) => game.id !== gameId));
	};

	const publishGame = async (gameId: string, shouldPublish: boolean) => {
		setUserGames((prev) =>
			prev.map((game) =>
				game.id === gameId
					? {
							...game,
							status: shouldPublish ? "published" : "draft",
							isPublic: shouldPublish,
							updatedAt: Date.now(),
						}
					: game,
			),
		);
	};

	const handlePublishToggle = async (
		gameId: string,
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
					<Card key={game.id} className="overflow-hidden">
						<div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
							{game.coverImageUrl ? (
								<img
									src={game.coverImageUrl}
									alt={game.title}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="flex items-center justify-center h-full">
									<Gamepad2 className="h-10 w-10 text-primary/40" />
								</div>
							)}

							<div className="absolute top-2 right-2">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 bg-background/80 backdrop-blur-sm"
										>
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>アクション</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem asChild>
											<Link to={`/dashboard/games/${game.id}/edit`}>
												<Edit className="mr-2 h-4 w-4" /> 編集
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link to={`/games/${game.id}`} target="_blank">
												<Eye className="mr-2 h-4 w-4" /> プレイ
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => handlePublishToggle(game.id, game.status)}
										>
											{game.status === "published" ? (
												<>
													<Lock className="mr-2 h-4 w-4" /> 非公開にする
												</>
											) : (
												<>
													<Globe className="mr-2 h-4 w-4" /> 公開する
												</>
											)}
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<DropdownMenuItem
													onSelect={(e) => e.preventDefault()}
													className="text-destructive"
												>
													<Trash2 className="mr-2 h-4 w-4" /> 削除
												</DropdownMenuItem>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														本当に削除しますか？
													</AlertDialogTitle>
													<AlertDialogDescription>
														この操作は元に戻せません。ゲームとそれに関連するすべてのデータが完全に削除されます。
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>キャンセル</AlertDialogCancel>
													<AlertDialogAction
														onClick={() => deleteGame(game.id)}
														className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
													>
														削除
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>

						<CardHeader className="pb-2">
							<div className="flex justify-between items-center">
								<CardTitle className="text-xl truncate">{game.title}</CardTitle>
								<Badge
									variant={
										game.status === "published" ? "default" : "secondary"
									}
								>
									{game.status === "published" ? "公開中" : "下書き"}
								</Badge>
							</div>
							<CardDescription className="line-clamp-2 h-10">
								{game.description || "説明なし"}
							</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>
		);
	}
}
