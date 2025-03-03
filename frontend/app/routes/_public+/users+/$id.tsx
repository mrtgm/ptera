import { Link, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { GameMetaData, UserProfile } from "~/schema";
import { useStore } from "~/stores";

import { Alert, AlertDescription } from "~/components/shadcn/alert";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "~/components/shadcn/avatar";
import { Badge } from "~/components/shadcn/badge";
// shadcn components
import { Button } from "~/components/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/shadcn/card";
import { Separator } from "~/components/shadcn/separator";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/shadcn/tabs";

// lucide icons
import {
	AlertTriangle,
	Calendar,
	Clock,
	Eye,
	Gamepad2,
	Heart,
	Mail,
	MessageSquare,
	ThumbsUp,
} from "lucide-react";
import GameCard from "~/features/dashboard/components/game-card";
import { formatDate } from "~/utils/date";

const sampleUserProfile: UserProfile = {
	id: "user-1",
	name: "ゲームクリエイター",
	email: "creator@example.com",
	bio: "ゲームクリエイターです。よろしくお願いします。",
	avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
	createdAt: Date.now().toLocaleString(),
	updatedAt: Date.now().toLocaleString(),
};

// Dummy game data
const sampleGames: GameMetaData[] = [
	{
		id: "game-1",
		title: "青い鳥を探して",
		author: "user-1",
		authorAvatarUrl: "https://placehold.co/32x32/3b82f6/ffffff?text=U",

		description:
			"幸せを探す少年の旅路を描いた物語。プレイヤーの選択によって異なる結末へと導かれる。",
		coverImageUrl:
			"https://placehold.co/400x225/3b82f6/ffffff?text=青い鳥を探して",
		schemaVersion: "1.0",
		status: "published",
		createdAt: 1708444800000,
		updatedAt: 1709913600000,
		playCount: 253,
		likeCount: 42,
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
		createdAt: 1706025600000,
		updatedAt: 1708704000000,
		playCount: 189,
		likeCount: 28,
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
										<Link to="/dashboard/settings">プロフィールを編集</Link>
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
