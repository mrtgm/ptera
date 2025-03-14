import type { GameMetaData } from "@/client/schema";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/client/components/shadcn/avatar";
import { Button } from "@/client/components/shadcn/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/client/components/shadcn/card";

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
} from "@/client/components/shadcn/alert-dialog";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/client/components/shadcn/dropdown-menu";

import { Badge } from "@/client/components/shadcn/badge";
import { formatDate } from "@/client/utils/date";
import { getInitials } from "@/client/utils/string";
import {
	Clock,
	Edit,
	Eye,
	Gamepad2,
	Globe,
	Heart,
	Lock,
	MoreVertical,
	Trash2,
} from "lucide-react";
import Link from "next/link";

interface GameCardProps {
	game: GameMetaData;
	showAuthor?: boolean;
	showEdit?: boolean;
	onDelete?: (id: number) => void;
	onPublishToggle?: (
		id: number,
		status: "published" | "draft" | "archived",
	) => void;
}

export default function GameCard({
	game,
	showAuthor = true,
	showEdit = false,
	onDelete,
	onPublishToggle,
}: GameCardProps) {
	return (
		<Card className="overflow-hidden flex flex-col h-full relative">
			<div className="h-40 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
				{game.coverImageUrl ? (
					<img
						src={game.coverImageUrl}
						alt={game.name}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="flex items-center justify-center h-full">
						<Gamepad2 className="h-10 w-10 text-primary/40" />
					</div>
				)}
			</div>

			{showEdit && (
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
								<Link href={`/dashboard/games/${game.id}/edit`}>
									<Edit className="mr-2 h-4 w-4" /> 編集
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href={`/games/${game.id}`} target="_blank">
									<Eye className="mr-2 h-4 w-4" /> プレイ
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onPublishToggle?.(game.id, game.status)}
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
										<AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
										<AlertDialogDescription>
											この操作は元に戻せません。ゲームとそれに関連するすべてのデータが完全に削除されます。
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>キャンセル</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => onDelete?.(game.id)}
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
			)}

			<CardHeader className="pb-2">
				<div className="flex justify-between items-center">
					<CardTitle className="text-xl truncate">{game.name}</CardTitle>
					{showEdit && (
						<Badge
							variant={game.status === "published" ? "default" : "secondary"}
						>
							{game.status === "published" ? "公開中" : "下書き"}
						</Badge>
					)}
				</div>
				<CardDescription className="line-clamp-2 h-10">
					{game.description || "説明なし"}
				</CardDescription>
			</CardHeader>

			<CardContent className="pb-2 pt-0 flex-grow">
				{showAuthor && (
					<div className="flex items-center">
						<Avatar className="h-6 w-6 mr-2">
							<AvatarImage src={game.avatarUrl} alt={game.username} />
							<AvatarFallback className="text-xs">
								{getInitials(game.username)}
							</AvatarFallback>
						</Avatar>
						<Link
							href={`/users/${game.userId}`}
							className="text-sm hover:underline"
						>
							{game.username}
						</Link>
					</div>
				)}

				<div className="flex items-center text-xs text-muted-foreground mt-2">
					<Clock className="mr-1 h-3 w-3" />
					<span>更新: {formatDate(game.updatedAt || game.createdAt)}</span>
				</div>
			</CardContent>

			<CardFooter className="flex justify-between pt-2 text-xs text-muted-foreground">
				<div className="flex items-center">
					<Eye className="mr-1 h-3 w-3" />
					<span>{game.playCount || 0}回プレイ</span>
				</div>
				<div className="flex items-center">
					<Heart className="mr-1 h-3 w-3" />
					<span>{game.likeCount || 0}いいね</span>
				</div>
			</CardFooter>

			{!showEdit && (
				<div className="p-3 bg-muted/50 border-t">
					<Button variant="default" size="sm" className="w-full" asChild>
						<Link href={`/games/${game.id}`}>プレイする</Link>
					</Button>
				</div>
			)}
		</Card>
	);
}
