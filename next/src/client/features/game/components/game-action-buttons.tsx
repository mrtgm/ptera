"use client";

import { api } from "@/client/api";
import { useAuthDialog } from "@/client/components/diaogs/auth-dialog";
import { Button } from "@/client/components/shadcn/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/client/components/shadcn/tooltip";

import { useStore } from "@/client/stores";
import { Flag, Heart, MessageSquare, RotateCcw, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const GameActionButtons = ({
	gameId,
	likeCount = 0,
	commentCount = 0,
}: {
	gameId: number;
	likeCount: number;
	commentCount: number | undefined;
}) => {
	const router = useRouter();
	const userSlice = useStore.useSlice.user();

	const [currentLikeCount, setCurrentLikeCount] = useState(Number(likeCount));

	const {
		AuthDialog: LikeAuthDialog,
		setAuthDialogOpen: setLikeAuthDialogOpen,
	} = useAuthDialog();

	const {
		AuthDialog: ReportAuthDialog,
		setAuthDialogOpen: setReportAuthDialogOpen,
	} = useAuthDialog();

	const handleLike = async () => {
		if (!userSlice.isAuthenticated) {
			setLikeAuthDialogOpen(true);
			return;
		}

		try {
			setCurrentLikeCount((prev) =>
				userSlice.isLiked(gameId) ? prev - 1 : prev + 1,
			);
			if (userSlice.isLiked(gameId)) {
				await userSlice.unlikeGame(gameId);
			} else {
				await userSlice.likeGame(gameId);
			}
			router.refresh();
		} catch (err) {
			console.error("Failed to toggle like:", err);
			setCurrentLikeCount(likeCount);
		}
	};

	const handleShare = async () => {
		try {
			if (navigator.share) {
				await navigator.share({
					title: document.title,
					url: window.location.href,
				});
			} else {
				// フォールバック、クリップボードにURLをコピー
				await navigator.clipboard.writeText(window.location.href);
				alert("URLをクリップボードにコピーしました");
			}
		} catch (err) {
			console.error("Failed to share:", err);
		}
	};

	const handleReport = () => {
		if (!userSlice.isAuthenticated) {
			setReportAuthDialogOpen(true);
			return;
		}

		// TODO: 報告機能を実装
		alert("この機能は現在開発中です");
	};

	return (
		<div className="flex flex-wrap gap-2 mb-6">
			<LikeAuthDialog message="いいねするにはログインが必要です" />
			<ReportAuthDialog message="報告するにはログインが必要です" />

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={userSlice.isLiked(gameId) ? "default" : "outline"}
							size="sm"
							onClick={handleLike}
						>
							<Heart
								className={`mr-2 h-4 w-4 ${userSlice.isLiked(gameId) ? "fill-white" : ""}`}
							/>
							いいね {currentLikeCount}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						{userSlice.isLiked(gameId) ? "いいねを取り消す" : "いいねする"}
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
								コメント {commentCount}
							</a>
						</Button>
					</TooltipTrigger>
					<TooltipContent>コメントを見る・投稿する</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" size="sm" onClick={handleReport}>
							<Flag className="mr-2 h-4 w-4" />
							報告
						</Button>
					</TooltipTrigger>
					<TooltipContent>問題を報告する</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
