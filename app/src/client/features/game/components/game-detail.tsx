import { Alert, AlertDescription } from "@/client/components/shadcn/alert";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/client/components/shadcn/avatar";
import { Badge } from "@/client/components/shadcn/badge";

import { api } from "@/client/api";
import { getInitials } from "@/client/utils/string";
import type { Category } from "@/schemas/games/domain/category";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { GameActionButtons } from "./game-action-buttons";
import { GameCommentSection } from "./game-comment-section";
import { GamePlayerWrapper } from "./game-wrapper";

export const GameDetail = async ({ gameId }: { gameId: number }) => {
	const [game, comments, categories] = await Promise.all([
		api.games.get(gameId),
		api.games.getComments(gameId),
		api.games.getCategories(),
	]);

	if (!game) {
		return (
			<Alert variant="destructive">
				<AlertTriangle className="h-4 w-4 mr-2" />
				<AlertDescription>ゲームが見つかりません</AlertDescription>
			</Alert>
		);
	}

	const getCategoryName = (categoryId: number) => {
		const category = categories?.find((cat: Category) => cat.id === categoryId);
		return category ? category.name : `カテゴリ ${categoryId}`;
	};

	return (
		<>
			<h1 className="text-3xl font-bold">{game.name}</h1>

			<div className="flex flex-wrap gap-2 mt-4">
				{game.categoryIds?.map((categoryId) => (
					<Badge key={categoryId} variant="secondary">
						{getCategoryName(categoryId)}
					</Badge>
				))}
			</div>

			<div className="flex items-center my-6">
				<Avatar className="h-8 w-8 mr-2">
					<AvatarImage src={game.avatarUrl} alt={game.username} />
					<AvatarFallback className="text-xs">
						{getInitials(game.username)}
					</AvatarFallback>
				</Avatar>
				<div>
					<Link
						href={`/users/${game.userId}`}
						className="text-sm font-medium hover:underline"
					>
						{game.username}
					</Link>
				</div>
			</div>

			<div className="mb-6">
				<GamePlayerWrapper gameId={gameId} initialGameData={game} />
			</div>

			<GameActionButtons
				gameId={gameId}
				likeCount={game.likeCount}
				commentCount={comments?.length}
			/>

			<GameCommentSection gameId={gameId} initialComments={comments} />
		</>
	);
};
