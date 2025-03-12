"use client";

import { useEffect, useState } from "react";
import type { GameMetaData } from "~/client/schema";

import { Alert, AlertDescription } from "~/client/components/shadcn/alert";
// shadcn components
import { Button } from "~/client/components/shadcn/button";
import { Input } from "~/client/components/shadcn/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/client/components/shadcn/select";
import { Tabs, TabsList, TabsTrigger } from "~/client/components/shadcn/tabs";

// lucide icons
import {
	AlertTriangle,
	ArrowUpDown,
	Filter,
	Gamepad2,
	Loader2,
	Search,
} from "lucide-react";
import GameCard from "~/client/features/dashboard/components/game-card";

// サンプルデータ - 実際の実装では API から取得します
const sampleGames: GameMetaData[] = [
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
		createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
		playCount: 253,
		likeCount: 42,
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
	},
	{
		id: "game-2",
		title: "迷宮の魔術師",
		author: "user-2",
		description:
			"古代の迷宮に閉じ込められた魔術師となり、謎を解いて脱出を目指す。複数のエンディングと隠しルートがある。",
		coverImageUrl:
			"https://placehold.co/400x225/a855f7/ffffff?text=迷宮の魔術師",
		schemaVersion: "1.0",
		status: "published",
		createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
		playCount: 189,
		likeCount: 28,
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
	},
	{
		id: "game-3",
		title: "時の砂時計",
		author: "user-3",
		description:
			"タイムトラベルをテーマにした選択型アドベンチャー。過去と未来を行き来しながら謎を解き明かす。",
		coverImageUrl: "https://placehold.co/400x225/f59e0b/ffffff?text=時の砂時計",
		schemaVersion: "1.0",
		status: "published",
		createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
		playCount: 312,
		likeCount: 67,
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mary",
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
		status: "published",
		createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
		playCount: 175,
		likeCount: 33,
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
	},
	{
		id: "game-5",
		title: "幽霊屋敷の秘密",
		author: "user-4",
		description:
			"古い洋館を探索するホラーアドベンチャー。様々な選択肢によって生存ルートが変化する。",
		coverImageUrl:
			"https://placehold.co/400x225/64748b/ffffff?text=幽霊屋敷の秘密",
		schemaVersion: "1.0",
		status: "published",
		createdAt: Date.now() - 75 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
		playCount: 221,
		likeCount: 42,
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
	},
	{
		id: "game-6",
		title: "星間飛行",
		author: "user-5",
		description:
			"宇宙船のクルーとなり、未知の惑星を探索する宇宙冒険。各キャラクターとの関係性によってストーリーが変化。",
		coverImageUrl: "https://placehold.co/400x225/06b6d4/ffffff?text=星間飛行",
		schemaVersion: "1.0",
		status: "published",
		createdAt: Date.now() - 85 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
		playCount: 287,
		likeCount: 56,
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
	},
];

// ジャンルのサンプルリスト
const categories = [
	"すべて",
	"アドベンチャー",
	"ミステリー",
	"ファンタジー",
	"SF",
	"ホラー",
	"恋愛",
	"歴史",
	"コメディ",
];

export default function GamesListPage() {
	const [games, setGames] = useState<GameMetaData[]>([]);
	const [filteredGames, setFilteredGames] = useState<GameMetaData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("all");
	const [sortBy, setSortBy] = useState("newest");
	const [selectedGenre, setSelectedGenre] = useState("すべて");

	useEffect(() => {
		const fetchGames = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// 実際の実装ではAPIからデータを取得
				// ここではサンプルデータを使用
				setTimeout(() => {
					setGames(sampleGames);
					setFilteredGames(sampleGames);
					setIsLoading(false);
				}, 800);
			} catch (err) {
				console.error("Failed to fetch games:", err);
				setError("ゲーム情報の取得に失敗しました");
				setIsLoading(false);
			}
		};

		fetchGames();
	}, []);

	// 検索とフィルタリングの適用
	useEffect(() => {
		let result = [...games];

		// 検索クエリでフィルタリング
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(game) =>
					game.title.toLowerCase().includes(query) ||
					game.description.toLowerCase().includes(query) ||
					game.author?.toLowerCase().includes(query),
			);
		}

		// タブでフィルタリング
		if (activeTab === "popular") {
			result = result.filter((game) => (game.playCount || 0) > 200);
		} else if (activeTab === "recent") {
			// 最近更新されたゲーム（30日以内）
			const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
			result = result.filter(
				(game) => (game.updatedAt || game.createdAt) > thirtyDaysAgo,
			);
		}

		// ジャンルでフィルタリング（実際はゲームにジャンルプロパティが必要）
		if (selectedGenre !== "すべて") {
			// サンプルの実装 - 実際のデータではジャンルフィールドが必要
			// ここではタイトルに基づいて仮のフィルタリングを実装
			const genreMap: Record<string, string[]> = {
				アドベンチャー: ["青い鳥", "海底都市", "星間飛行"],
				ミステリー: ["迷宮", "幽霊屋敷"],
				SF: ["時の砂時計", "星間飛行"],
				ホラー: ["幽霊屋敷"],
				ファンタジー: ["青い鳥", "迷宮"],
			};

			const keywords = genreMap[selectedGenre] || [];
			if (keywords.length > 0) {
				result = result.filter((game) =>
					keywords.some((keyword) => game.title.includes(keyword)),
				);
			}
		}

		// ソート
		if (sortBy === "newest") {
			result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
		} else if (sortBy === "popular") {
			result.sort((a, b) => (b.playCount || 0) - (a.playCount || 0));
		} else if (sortBy === "likes") {
			result.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
		}

		setFilteredGames(result);
	}, [games, searchQuery, activeTab, sortBy, selectedGenre]);

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold">ゲーム一覧</h1>
				<p className="text-muted-foreground mt-2">
					オリジナルのビジュアルノベルやアドベンチャーゲームを探索しよう
				</p>
			</div>

			{/* 検索とフィルターコントロール */}
			<div className="flex flex-col md:flex-row gap-4 mb-6">
				<div className="relative flex-grow">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="ゲームやクリエイターを検索..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>

				<div className="flex gap-2">
					<Select value={selectedGenre} onValueChange={setSelectedGenre}>
						<SelectTrigger className="w-[180px]">
							<Filter className="h-4 w-4 mr-2" />
							<SelectValue placeholder="ジャンル" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((genre) => (
								<SelectItem key={genre} value={genre}>
									{genre}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger className="w-[180px]">
							<ArrowUpDown className="h-4 w-4 mr-2" />
							<SelectValue placeholder="並び替え" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">新着順</SelectItem>
							<SelectItem value="popular">人気順</SelectItem>
							<SelectItem value="likes">いいね順</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Tabs
				defaultValue="all"
				value={activeTab}
				onValueChange={setActiveTab}
				className="mb-6"
			>
				<TabsList>
					<TabsTrigger value="all">すべて</TabsTrigger>
					<TabsTrigger value="popular">人気</TabsTrigger>
					<TabsTrigger value="recent">最近の更新</TabsTrigger>
				</TabsList>
			</Tabs>

			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertTriangle className="h-4 w-4 mr-2" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{isLoading ? (
				<div className="flex justify-center items-center py-20">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<span className="ml-2 text-muted-foreground">
						ゲームを読み込み中...
					</span>
				</div>
			) : filteredGames.length === 0 ? (
				<div className="text-center py-12">
					<Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
					<h2 className="text-xl font-semibold mb-2">
						ゲームが見つかりませんでした
					</h2>
					<p className="text-muted-foreground">
						検索条件を変更するか、後でまた確認してください
					</p>
				</div>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredGames.map((game) => (
						<GameCard key={game.id} game={game} showAuthor />
					))}
				</div>
			)}

			{/* ページネーション - 実際の実装では必要に応じて追加 */}
			{!isLoading && filteredGames.length > 0 && (
				<div className="flex justify-center mt-8">
					<Button variant="outline" className="mx-1">
						前へ
					</Button>
					<Button variant="outline" className="mx-1">
						1
					</Button>
					<Button variant="default" className="mx-1">
						2
					</Button>
					<Button variant="outline" className="mx-1">
						3
					</Button>
					<Button variant="outline" className="mx-1">
						次へ
					</Button>
				</div>
			)}
		</div>
	);
}
