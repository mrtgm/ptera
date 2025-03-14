"use client";

import type { GameMetaData, UserProfile } from "@/client/schema";
import { useEffect, useState } from "react";
import { useStore } from "~/client/stores";

import { Alert, AlertDescription } from "~/client/components/shadcn/alert";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "~/client/components/shadcn/avatar";
// shadcn components
import { Button } from "~/client/components/shadcn/button";
import { Card, CardContent } from "~/client/components/shadcn/card";

// lucide icons
import { AlertTriangle, Eye, Gamepad2, Mail, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import GameCard from "~/client/features/dashboard/components/game-card";

const sampleUserProfile: UserProfile = {
	id: 0,
	name: "ゲームクリエイター",
	jwtSub: "user-1",
	bio: "ゲームクリエイターです。よろしくお願いします。",
	avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
};

// Dummy game data
const sampleGames: GameMetaData[] = [
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

export default function UserProfilePage() {
	const { id } = useParams();
	const [user, setUser] = useState<UserProfile | null>(null);
	const [userGames, setUserGames] = useState<GameMetaData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("games");

	const currentUser = useStore((state) => state.currentUser);
	const isCurrentUser = currentUser?.id === id;

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// 実際の実装ではAPIからデータを取得
				// ここではサンプルデータを使用
				setTimeout(() => {
					setUser(sampleUserProfile);
					setUserGames(sampleGames);
					setIsLoading(false);
				}, 500);
			} catch (err) {
				console.error("Failed to fetch user data:", err);
				setError("ユーザー情報の取得に失敗しました");
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((part) => part.charAt(0))
			.join("")
			.toUpperCase();
	};

	if (isLoading) {
		return (
			<div className="container max-w-4xl mx-auto py-8 px-4">
				<div className="flex items-center justify-center h-64">
					<p className="text-muted-foreground">ユーザー情報を読み込み中...</p>
				</div>
			</div>
		);
	}

	if (error || !user) {
		return (
			<div className="container max-w-4xl mx-auto py-8 px-4">
				<Alert variant="destructive">
					<AlertTriangle className="h-4 w-4 mr-2" />
					<AlertDescription>
						{error || "ユーザーが見つかりません"}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="container max-w-4xl mx-auto py-8 px-4">
			{/* ユーザープロフィールカード */}
			<Card className="mb-6">
				<CardContent className="p-6">
					<div className="flex flex-col md:flex-row items-center md:items-start gap-6">
						<Avatar className="h-24 w-24">
							<AvatarImage src={user.avatarUrl} alt={user.name} />
							<AvatarFallback className="text-2xl">
								{getInitials(user.name)}
							</AvatarFallback>
						</Avatar>

						<div className="flex-1 text-center md:text-left">
							<h1 className="text-2xl font-bold">{user.name}</h1>

							<div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground">
								<div className="bg-green-50/50 rounded-lg p-3 text-center text-green-600">
									<Eye className="h-5 w-5 mx-auto mb-1" />
									<p className="text-2xl font-bold">
										{userGames.reduce(
											(sum, game) => sum + (game.playCount || 0),
											0,
										)}
									</p>
									<p className="text-xs">総プレイ数</p>
								</div>
								<div className="bg-orange-50/50 rounded-lg p-3 text-center text-orange-400">
									<ThumbsUp className="h-5 w-5 mx-auto mb-1" />
									<p className="text-2xl font-bold">
										{userGames.reduce(
											(sum, game) => sum + (game.likeCount || 0),
											0,
										)}
									</p>
									<p className="text-xs">総いいね数</p>
								</div>
								<div className="flex items-center">
									<Gamepad2 className="h-4 w-4 mr-1" />
									<span>ゲーム数: {userGames.length}</span>
								</div>
							</div>

							{user.bio && (
								<div className="mt-4">
									<p className="text-sm text-gray-700">{user.bio}</p>
								</div>
							)}

							<div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
								{isCurrentUser ? (
									<Button variant="outline" size="sm" asChild>
										<Link href="/dashboard/settings">プロフィールを編集</Link>
									</Button>
								) : (
									<Button variant="outline" size="sm">
										<Mail className="h-4 w-4 mr-2" />
										メッセージを送る
									</Button>
								)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<h2 className="text-xl font-semibold mb-4">{user.name}のゲーム</h2>

			{userGames.length === 0 ? (
				<Card>
					<CardContent className="py-8 text-center">
						<Gamepad2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
						<p className="text-muted-foreground">
							まだゲームを公開していません
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{userGames.map((game) => (
						<GameCard key={game.id} game={game} showAuthor={false} />
					))}
				</div>
			)}
		</div>
	);
}
