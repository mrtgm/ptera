import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { GameMetaData } from "~/schema";

// shadcn components
import { Button } from "~/components/shadcn/button";

// lucide icons
import { ArrowRight, Clock, TrendingUp } from "lucide-react";

// カスタムコンポーネント
import GameCard from "~/features/dashboard/components/game-card";
// サンプルゲームデータ
const sampleFeaturedGames: GameMetaData[] = [
	{
		id: "game-1",
		title: "青い鳥を探して",
		author: "user-1",
		description:
			"幸せを探す少年の旅路を描いた物語。プレイヤーの選択によって異なる結末へと導かれる。",
		coverImageUrl:
			"https://placehold.co/1200x630/3b82f6/ffffff?text=青い鳥を探して",
		schemaVersion: "1.0",
		status: "published",
		createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
		playCount: 253,
		likeCount: 42,
		authorName: "ゲームクリエイター",
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
	},
	{
		id: "game-3",
		title: "時の砂時計",
		author: "user-3",
		description:
			"タイムトラベルをテーマにした選択型アドベンチャー。過去と未来を行き来しながら謎を解き明かす。",
		coverImageUrl:
			"https://placehold.co/1200x630/f59e0b/ffffff?text=時の砂時計",
		schemaVersion: "1.0",
		status: "published",
		createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
		playCount: 312,
		likeCount: 67,
		authorName: "ストーリーテラー",
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mary",
	},
	{
		id: "game-6",
		title: "星間飛行",
		author: "user-5",
		description:
			"宇宙船のクルーとなり、未知の惑星を探索する宇宙冒険。各キャラクターとの関係性によってストーリーが変化。",
		coverImageUrl: "https://placehold.co/1200x630/06b6d4/ffffff?text=星間飛行",
		schemaVersion: "1.0",
		status: "published",
		createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
		playCount: 287,
		likeCount: 56,
		authorName: "SFファン",
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
	},
];

const sampleNewGames: GameMetaData[] = [
	{
		id: "game-7",
		title: "夢幻の森",
		author: "user-6",
		description:
			"神秘的な森の中で繰り広げられる冒険。精霊たちとの出会いが主人公の運命を変える。",
		coverImageUrl: "https://placehold.co/400x225/22c55e/ffffff?text=夢幻の森",
		schemaVersion: "1.0",
		status: "published",
		createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
		playCount: 87,
		likeCount: 23,
		authorName: "森の物語",
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Forest",
	},
	{
		id: "game-8",
		title: "記憶の欠片",
		author: "user-7",
		description:
			"記憶を失った主人公が過去を紐解いていく心理サスペンス。選択によって明かされる真実とは？",
		coverImageUrl: "https://placehold.co/400x225/8b5cf6/ffffff?text=記憶の欠片",
		schemaVersion: "1.0",
		status: "published",
		createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
		playCount: 145,
		likeCount: 38,
		authorName: "ミステリー作家",
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mystery",
	},
	{
		id: "game-9",
		title: "街角の喫茶店",
		author: "user-8",
		description:
			"小さな喫茶店を舞台にした日常系ビジュアルノベル。店に訪れる様々な人々との交流を楽しもう。",
		coverImageUrl:
			"https://placehold.co/400x225/ec4899/ffffff?text=街角の喫茶店",
		schemaVersion: "1.0",
		status: "published",
		createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
		playCount: 112,
		likeCount: 45,
		authorName: "日常系作家",
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coffee",
	},
	{
		id: "game-10",
		title: "古城の秘宝",
		author: "user-9",
		description:
			"古い城を探索して秘宝を見つけ出す冒険ゲーム。トラップや謎解きが待ち受ける。",
		coverImageUrl: "https://placehold.co/400x225/f97316/ffffff?text=古城の秘宝",
		schemaVersion: "1.0",
		status: "published",
		createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
		playCount: 95,
		likeCount: 27,
		authorName: "冒険者",
		authorAvatarUrl:
			"https://api.dicebear.com/7.x/avataaars/svg?seed=Adventure",
	},
];

const samplePopularGames: GameMetaData[] = [
	{
		id: "game-3",
		title: "時の砂時計",
		author: "user-3",
		description:
			"タイムトラベルをテーマにした選択型アドベンチャー。過去と未来を行き来しながら謎を解き明かす。",
		coverImageUrl: "https://placehold.co/400x225/f59e0b/ffffff?text=時の砂時計",
		schemaVersion: "1.0",
		status: "published",
		playCount: 312,
		likeCount: 67,
		authorName: "ストーリーテラー",
		createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mary",
	},
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
		playCount: 253,
		likeCount: 42,
		authorName: "ゲームクリエイター",
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
		createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
	},
	{
		id: "game-6",
		title: "星間飛行",
		author: "user-5",
		authorName: "SFファン",
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
		description:
			"宇宙船のクルーとなり、未知の惑星を探索する宇宙冒険。各キャラクターとの関係性によってストーリーが変化。",
		coverImageUrl: "https://placehold.co/400x225/06b6d4/ffffff?text=星間飛行",
		schemaVersion: "1.0",
		status: "published",
		playCount: 287,
		likeCount: 56,
		createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
	},
	{
		id: "game-5",
		title: "幽霊屋敷の秘密",
		author: "user-4",
		authorName: "ホラーマスター",
		description:
			"古い洋館を探索するホラーアドベンチャー。様々な選択肢によって生存ルートが変化する。",
		coverImageUrl:
			"https://placehold.co/400x225/64748b/ffffff?text=幽霊屋敷の秘密",
		schemaVersion: "1.0",
		status: "published",
		playCount: 221,
		likeCount: 42,
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
		createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
		updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
	},
];

export default function HomePage() {
	const [newGames, setNewGames] = useState<GameMetaData[]>([]);
	const [popularGames, setPopularGames] = useState<GameMetaData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchGames = async () => {
			try {
				setIsLoading(true);

				// 実際の実装ではAPIからデータを取得
				// ここではサンプルデータを使用
				setTimeout(() => {
					setNewGames(sampleNewGames);
					setPopularGames(samplePopularGames);
					setIsLoading(false);
				}, 500);
			} catch (err) {
				console.error("Failed to fetch games:", err);
				setIsLoading(false);
			}
		};

		fetchGames();
	}, []);

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
							<Link to="/register">&gt; ゲームを作る</Link>
						</Button>
						<Button
							size="lg"
							variant="ghost"
							className="text-lg font-bold hover:animate-text-blink"
							asChild
						>
							<Link to="/games">&gt; ゲームを探す</Link>
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
							<Link to="/games?sort=newest">
								もっと見る <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{newGames.map((game) => (
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
							<Link to="/games?sort=popular">
								もっと見る <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{popularGames.map((game) => (
							<GameCard key={game.id} game={game} />
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
