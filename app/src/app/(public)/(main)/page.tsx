import { Button } from "@/client/components/shadcn/button";
import type { GameMetaData } from "@/client/schema";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";

import GameCard from "@/client/features/dashboard/components/game-card";
import Link from "next/link";

const sampleFeaturedGames: GameMetaData[] = [
	{
		id: 1,
		userId: 101,
		name: "青い鳥を探して",
		description:
			"幸せを探す少年の旅路を描いた物語。プレイヤーの選択によって異なる結末へと導かれる。",
		releaseDate: "2025-02-10T00:00:00.000Z",
		coverImageUrl:
			"https://placehold.co/1200x630/3b82f6/ffffff?text=青い鳥を探して",
		schemaVersion: "1.0",
		status: "published",
		categoryIds: [1, 3],
		likeCount: 42,
		playCount: 253,
		createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		username: "ゲームクリエイター",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
	},
	{
		id: 3,
		userId: 103,
		name: "時の砂時計",
		description:
			"タイムトラベルをテーマにした選択型アドベンチャー。過去と未来を行き来しながら謎を解き明かす。",
		releaseDate: "2025-02-05T00:00:00.000Z",
		coverImageUrl:
			"https://placehold.co/1200x630/f59e0b/ffffff?text=時の砂時計",
		schemaVersion: "1.0",
		status: "published",
		categoryIds: [2, 5],
		likeCount: 67,
		playCount: 312,
		createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		username: "ストーリーテラー",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mary",
	},
	{
		id: 6,
		userId: 105,
		name: "星間飛行",
		description:
			"宇宙船のクルーとなり、未知の惑星を探索する宇宙冒険。各キャラクターとの関係性によってストーリーが変化。",
		releaseDate: "2025-01-28T00:00:00.000Z",
		coverImageUrl: "https://placehold.co/1200x630/06b6d4/ffffff?text=星間飛行",
		schemaVersion: "1.0",
		status: "published",
		categoryIds: [4, 6],
		likeCount: 56,
		playCount: 287,
		createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		username: "SFファン",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
	},
];

const sampleNewGames: GameMetaData[] = [
	{
		id: 7,
		userId: 106,
		name: "夢幻の森",
		description:
			"神秘的な森の中で繰り広げられる冒険。精霊たちとの出会いが主人公の運命を変える。",
		releaseDate: "2025-03-12T00:00:00.000Z",
		coverImageUrl: "https://placehold.co/400x225/22c55e/ffffff?text=夢幻の森",
		schemaVersion: "1.0",
		status: "published",
		categoryIds: [1, 7],
		likeCount: 23,
		playCount: 87,
		createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		username: "森の物語",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Forest",
	},
	{
		id: 8,
		userId: 107,
		name: "記憶の欠片",
		description:
			"記憶を失った主人公が過去を紐解いていく心理サスペンス。選択によって明かされる真実とは？",
		releaseDate: "2025-03-11T00:00:00.000Z",
		coverImageUrl: "https://placehold.co/400x225/8b5cf6/ffffff?text=記憶の欠片",
		schemaVersion: "1.0",
		status: "published",
		categoryIds: [2, 8],
		likeCount: 38,
		playCount: 145,
		createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		username: "ミステリー作家",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mystery",
	},
	{
		id: 9,
		userId: 108,
		name: "街角の喫茶店",
		description:
			"小さな喫茶店を舞台にした日常系ビジュアルノベル。店に訪れる様々な人々との交流を楽しもう。",
		releaseDate: "2025-03-10T00:00:00.000Z",
		coverImageUrl:
			"https://placehold.co/400x225/ec4899/ffffff?text=街角の喫茶店",
		schemaVersion: "1.0",
		status: "published",
		categoryIds: [3, 9],
		likeCount: 45,
		playCount: 112,
		createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		username: "日常系作家",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coffee",
	},
	{
		id: 10,
		userId: 109,
		name: "古城の秘宝",
		description:
			"古い城を探索して秘宝を見つけ出す冒険ゲーム。トラップや謎解きが待ち受ける。",
		releaseDate: "2025-03-09T00:00:00.000Z",
		coverImageUrl: "https://placehold.co/400x225/f97316/ffffff?text=古城の秘宝",
		schemaVersion: "1.0",
		status: "published",
		categoryIds: [4, 10],
		likeCount: 27,
		playCount: 95,
		createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		username: "冒険者",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adventure",
	},
];

const samplePopularGames: GameMetaData[] = [
	{
		id: 3,
		userId: 103,
		name: "時の砂時計",
		description:
			"タイムトラベルをテーマにした選択型アドベンチャー。過去と未来を行き来しながら謎を解き明かす。",
		releaseDate: "2025-02-05T00:00:00.000Z",
		coverImageUrl: "https://placehold.co/400x225/f59e0b/ffffff?text=時の砂時計",
		schemaVersion: "1.0",
		status: "published",
		categoryIds: [2, 5],
		likeCount: 67,
		playCount: 312,
		createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		username: "ストーリーテラー",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mary",
	},
	{
		id: 1,
		userId: 101,
		name: "青い鳥を探して",
		description:
			"幸せを探す少年の旅路を描いた物語。プレイヤーの選択によって異なる結末へと導かれる。",
		releaseDate: "2025-02-10T00:00:00.000Z",
		coverImageUrl:
			"https://placehold.co/400x225/3b82f6/ffffff?text=青い鳥を探して",
		schemaVersion: "1.0",
		status: "published",
		categoryIds: [1, 3],
		likeCount: 42,
		playCount: 253,
		createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		username: "ゲームクリエイター",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
	},
	{
		id: 6,
		userId: 105,
		name: "星間飛行",
		description:
			"宇宙船のクルーとなり、未知の惑星を探索する宇宙冒険。各キャラクターとの関係性によってストーリーが変化。",
		releaseDate: "2025-01-28T00:00:00.000Z",
		coverImageUrl: "https://placehold.co/400x225/06b6d4/ffffff?text=星間飛行",
		schemaVersion: "1.0",
		status: "published",
		categoryIds: [4, 6],
		likeCount: 56,
		playCount: 287,
		createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		username: "SFファン",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
	},
	{
		id: 5,
		userId: 104,
		name: "幽霊屋敷の秘密",
		description:
			"古い洋館を探索するホラーアドベンチャー。様々な選択肢によって生存ルートが変化する。",
		releaseDate: "2025-02-01T00:00:00.000Z",
		coverImageUrl:
			"https://placehold.co/400x225/64748b/ffffff?text=幽霊屋敷の秘密",
		schemaVersion: "1.0",
		status: "published",
		categoryIds: [2, 11],
		likeCount: 42,
		playCount: 221,
		createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
		updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
		username: "ホラーマスター",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
	},
];

export default function HomePage() {
	// const [newGames, setNewGames] = useState<GameMetaData[]>([]);
	// const [popularGames, setPopularGames] = useState<GameMetaData[]>([]);
	// const [isLoading, setIsLoading] = useState(true);

	// useEffect(() => {
	// 	const fetchGames = async () => {
	// 		try {
	// 			setIsLoading(true);

	// 			// 実際の実装ではAPIからデータを取得
	// 			// ここではサンプルデータを使用
	// 			setTimeout(() => {
	// 				setNewGames(sampleNewGames);
	// 				setPopularGames(samplePopularGames);
	// 				setIsLoading(false);
	// 			}, 500);
	// 		} catch (err) {
	// 			console.error("Failed to fetch games:", err);
	// 			setIsLoading(false);
	// 		}
	// 	};

	// 	fetchGames();
	// }, []);

	const getInitials = (name = "") => {
		return name
			.split(" ")
			.map((part) => part.charAt(0))
			.join("")
			.toUpperCase();
	};

	return (
		<div>
			{/* ヒーローセクション */}
			<section className="relative py-20 flex flex-col gap-3">
				<div className="container mx-auto px-4 text-center col-span-5">
					<p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto font-[DotGothic16] ">
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
							<Link href="/register">&gt; ゲームを作る</Link>
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
							<Link href="/games?sort=newest">
								もっと見る <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{sampleNewGames.map((game) => (
							<GameCard key={game.id} game={game} />
						))}
					</div>
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
							<Link href="/games?sort=popular">
								もっと見る <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{samplePopularGames.map((game) => (
							<GameCard key={game.id} game={game} />
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
