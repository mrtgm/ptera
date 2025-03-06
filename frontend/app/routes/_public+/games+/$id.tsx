import { Link, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { Game, GameMetaData } from "~/schema";
import { useStore } from "~/stores";

// lucide icons
import {
	AlertTriangle,
	Award,
	Calendar,
	ChevronLeft,
	Clock,
	Eye,
	Flag,
	Heart,
	Loader2,
	MessageSquare,
	RotateCcw,
	Share2,
} from "lucide-react";
import dummyAssets from "~/__mocks__/dummy-assets.json";
import dummyGame from "~/__mocks__/dummy-game.json";
import { Alert, AlertDescription } from "~/components/shadcn/alert";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "~/components/shadcn/avatar";
import { Badge } from "~/components/shadcn/badge";
// shadcn components
import { Button } from "~/components/shadcn/button";
import { Card, CardContent } from "~/components/shadcn/card";
import { Separator } from "~/components/shadcn/separator";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/shadcn/tabs";
import { Textarea } from "~/components/shadcn/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/shadcn/tooltip";
import GamePlayer from "~/features/player";
import { EventManager } from "~/features/player/utils/event";

// サンプルゲームデータ
const sampleGame: GameMetaData = {
	id: "game-1",
	title: "青い鳥を探して",
	author: "user-1",
	authorName: "user-1",
	description:
		"幸せを探す少年の旅路を描いた物語。プレイヤーの選択によって異なる結末へと導かれる。\n\n主人公のタロウは、ある日不思議な青い鳥と出会います。青い鳥は彼に「本当の幸せ」を見つける旅に出るよう語りかけます。\n\nこのゲームでは、タロウの選択を通じて様々なエンディングへと導かれます。友情、冒険、愛、そして時には悲しみを通じて「本当の幸せとは何か」を考えさせられる物語です。",
	coverImageUrl:
		"https://placehold.co/1200x630/3b82f6/ffffff?text=青い鳥を探して",
	schemaVersion: "1.0",
	status: "published",
	createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
	updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
	playCount: 253,
	likeCount: 42,
	authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
	categories: ["アドベンチャー", "ファンタジー"],
	releaseDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
};

// サンプルコメントデータ
const sampleComments = [
	{
		id: "comment-1",
		authorName: "ユーザー1",
		authorId: "user-2",
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
		content: "素晴らしいストーリーでした！特に最後の選択が感動的でした。",
		createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
	},
	{
		id: "comment-2",
		authorName: "ユーザー2",
		authorId: "user-3",
		authorAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mary",
		content: "何度もプレイしました。毎回違う結末が見られて面白いです。",
		createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
	},
];

const eventManager = new EventManager();

export default function GameDetailPage() {
	const { id } = useParams();
	const [game, setGame] = useState<GameMetaData | null>(null);
	const [comments, setComments] = useState<
		{
			id: string;
			authorId: string;
			authorName: string;
			authorAvatarUrl: string;
			content: string;
			createdAt: number;
		}[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("about");
	const [commentText, setCommentText] = useState("");
	const [isSubmittingComment, setIsSubmittingComment] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [isGameLoading, setIsGameLoading] = useState(true);

	const { isAuthenticated, currentUser } = useStore((state) => ({
		isAuthenticated: state.isAuthenticated,
		currentUser: state.currentUser,
	}));

	useEffect(() => {
		const fetchGame = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// 実際の実装ではAPIからデータを取得
				// ここではサンプルデータを使用
				setTimeout(() => {
					setGame(sampleGame);
					setComments(sampleComments);
					setIsLoading(false);

					// ゲーム読み込みシミュレーション
					setTimeout(() => {
						setIsGameLoading(false);
					}, 1500);
				}, 800);
			} catch (err) {
				console.error("Failed to fetch game:", err);
				setError("ゲーム情報の取得に失敗しました");
				setIsLoading(false);
			}
		};

		fetchGame();
	}, []);

	const formatDate = (timestamp: number | string) => {
		const date =
			typeof timestamp === "string" ? new Date(timestamp) : new Date(timestamp);

		return date.toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatRelativeTime = (timestamp: number) => {
		const now = Date.now();
		const diff = now - timestamp;

		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 7) {
			return formatDate(timestamp);
		}
		if (days > 0) {
			return `${days}日前`;
		}
		if (hours > 0) {
			return `${hours}時間前`;
		}
		if (minutes > 0) {
			return `${minutes}分前`;
		}
		return "たった今";
	};

	const getInitials = (name = "") => {
		return name
			.split(" ")
			.map((part) => part.charAt(0))
			.join("")
			.toUpperCase();
	};

	const handleLike = () => {
		if (!isAuthenticated) {
			alert("いいねするにはログインしてください");
			return;
		}

		setIsLiked(!isLiked);
		// 実際の実装ではAPIを呼び出す
	};

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: game?.title || "ゲームを共有",
				text: game?.description || "",
				url: window.location.href,
			});
		} else {
			// クリップボードにURLをコピー
			navigator.clipboard.writeText(window.location.href);
			alert("URLがクリップボードにコピーされました");
		}
	};

	const handleCommentSubmit = () => {
		if (!isAuthenticated) {
			alert("コメントするにはログインしてください");
			return;
		}

		if (!commentText.trim()) return;

		setIsSubmittingComment(true);

		// 実際の実装ではAPIを呼び出す
		setTimeout(() => {
			const newComment = {
				id: `comment-${Date.now()}`,
				authorName: currentUser?.name || "ユーザー",
				authorId: currentUser?.id || "unknown",
				authorAvatarUrl: currentUser?.avatarUrl ?? "",
				content: commentText,
				createdAt: Date.now(),
			};

			setComments([newComment, ...comments]);
			setCommentText("");
			setIsSubmittingComment(false);
		}, 500);
	};

	const handleRestart = () => {
		setIsGameLoading(true);

		// 実際の実装ではゲームをリセット
		setTimeout(() => {
			setIsGameLoading(false);
		}, 1000);
	};

	if (isLoading) {
		return (
			<div className="container max-w-5xl mx-auto py-8 px-4">
				<div className="flex items-center justify-center h-64">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<span className="ml-2 text-muted-foreground">
						ゲームを読み込み中...
					</span>
				</div>
			</div>
		);
	}

	if (error || !game) {
		return (
			<div className="container max-w-5xl mx-auto py-8 px-4">
				<Alert variant="destructive">
					<AlertTriangle className="h-4 w-4 mr-2" />
					<AlertDescription>
						{error || "ゲームが見つかりません"}
					</AlertDescription>
				</Alert>
				<div className="mt-4">
					<Button variant="outline" asChild>
						<Link to="/games">
							<ChevronLeft className="mr-2 h-4 w-4" />
							ゲーム一覧に戻る
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container max-w-5xl mx-auto py-8 px-4">
			{/* ゲームタイトルとナビゲーション */}
			<div className="mb-4">
				<Button variant="outline" size="sm" asChild className="mb-4">
					<Link to="/games">
						<ChevronLeft className="mr-2 h-4 w-4" />
						ゲーム一覧に戻る
					</Link>
				</Button>

				<h1 className="text-3xl font-bold">{game.title}</h1>

				<div className="flex flex-wrap gap-2 mt-4">
					{game.categories?.map((genre) => (
						<Badge key={genre} variant="secondary">
							{genre}
						</Badge>
					))}
				</div>
			</div>

			{/* 作者情報 */}
			<div className="flex items-center mb-6">
				<Avatar className="h-8 w-8 mr-2">
					<AvatarImage src={game.authorAvatarUrl} alt={game.authorName} />
					<AvatarFallback className="text-xs">
						{getInitials(game.authorName)}
					</AvatarFallback>
				</Avatar>
				<div>
					<Link
						to={`/users/${game.authorName}`}
						className="text-sm font-medium hover:underline"
					>
						{game.authorName}
					</Link>
				</div>
			</div>

			{/* ゲームプレイエリア */}
			<div className="mb-6">
				<Card>
					<CardContent className="p-0 aspect-video relative">
						<GamePlayer
							game={dummyGame as Game}
							resources={dummyAssets}
							eventManager={eventManager}
						/>
					</CardContent>
				</Card>
			</div>

			{/* ゲーム操作ボタン */}
			<div className="flex flex-wrap gap-2 mb-6">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline" size="sm" onClick={handleRestart}>
								<RotateCcw className="mr-2 h-4 w-4" />
								リスタート
							</Button>
						</TooltipTrigger>
						<TooltipContent>ゲームをはじめから開始します</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant={isLiked ? "default" : "outline"}
								size="sm"
								onClick={handleLike}
							>
								<Heart
									className={`mr-2 h-4 w-4 ${isLiked ? "fill-white" : ""}`}
								/>
								いいね {(game.likeCount || 0) + (isLiked ? 1 : 0)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							{isLiked ? "いいねを取り消す" : "いいねする"}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline" size="sm" onClick={handleShare}>
								<Share2 className="mr-2 h-4 w-4" />
								共有
							</Button>
						</TooltipTrigger>
						<TooltipContent>ゲームを友達と共有</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline" size="sm" asChild>
								<a href="#comments">
									<MessageSquare className="mr-2 h-4 w-4" />
									コメント {comments.length}
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>コメントを見る・投稿する</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline" size="sm">
								<Flag className="mr-2 h-4 w-4" />
								報告
							</Button>
						</TooltipTrigger>
						<TooltipContent>問題を報告する</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			{/* ゲーム情報タブ */}
			<Tabs
				defaultValue="about"
				value={activeTab}
				onValueChange={setActiveTab}
				className="mb-6"
			>
				<TabsList className="mb-4">
					<TabsTrigger value="about">概要</TabsTrigger>
					<TabsTrigger value="comments" id="comments">
						コメント
					</TabsTrigger>
				</TabsList>

				<TabsContent value="about">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="md:col-span-2">
							<h2 className="text-xl font-bold mb-3">説明</h2>
							<div className="whitespace-pre-line text-sm">
								{game.description}
							</div>
						</div>

						<div>
							<h2 className="text-xl font-bold mb-3">ゲーム情報</h2>
							<div className="border rounded-lg p-4 space-y-4">
								<div className="flex justify-between items-center">
									<div className="flex items-center text-sm text-muted-foreground">
										<Eye className="mr-2 h-4 w-4" />
										プレイ数
									</div>
									<span className="font-medium">{game.playCount || 0}</span>
								</div>

								<div className="flex justify-between items-center">
									<div className="flex items-center text-sm text-muted-foreground">
										<Heart className="mr-2 h-4 w-4" />
										いいね数
									</div>
									<span className="font-medium">{game.likeCount || 0}</span>
								</div>

								<div className="flex justify-between items-center">
									<div className="flex items-center text-sm text-muted-foreground">
										<Calendar className="mr-2 h-4 w-4" />
										リリース日
									</div>
									<span className="font-medium">
										{formatDate(game.releaseDate || game.createdAt)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="comments">
					<h2 className="text-xl font-bold mb-4">コメント</h2>

					{/* コメント投稿フォーム */}
					<div className="mb-6">
						<Textarea
							placeholder={
								isAuthenticated
									? "コメントを入力してください..."
									: "コメントするにはログインしてください"
							}
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
							disabled={!isAuthenticated || isSubmittingComment}
							className="mb-2"
							rows={3}
						/>
						<div className="flex justify-end">
							<Button
								onClick={handleCommentSubmit}
								disabled={
									!isAuthenticated || !commentText.trim() || isSubmittingComment
								}
							>
								{isSubmittingComment && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								投稿する
							</Button>
						</div>
					</div>

					{/* コメント一覧 */}
					<div className="space-y-4">
						{comments.length === 0 ? (
							<div className="text-center py-8">
								<MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
								<p className="text-muted-foreground">
									まだコメントはありません
								</p>
								<p className="text-sm text-muted-foreground">
									最初のコメントを投稿してみましょう！
								</p>
							</div>
						) : (
							comments.map((comment) => (
								<div key={comment.id} className="border rounded-lg p-4">
									<div className="flex items-center mb-2">
										<Avatar className="h-6 w-6 mr-2">
											<AvatarImage
												src={comment.authorAvatarUrl}
												alt={comment.authorName}
											/>
											<AvatarFallback className="text-xs">
												{getInitials(comment.authorName)}
											</AvatarFallback>
										</Avatar>
										<Link
											to={`/users/${comment.authorId}`}
											className="text-sm font-medium hover:underline"
										>
											{comment.authorName}
										</Link>
										<span className="text-xs text-muted-foreground ml-2">
											{formatRelativeTime(comment.createdAt)}
										</span>
									</div>
									<p className="text-sm">{comment.content}</p>
								</div>
							))
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
