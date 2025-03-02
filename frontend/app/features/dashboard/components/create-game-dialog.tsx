import { useNavigate } from "@remix-run/react";
import { useState } from "react";

import { Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/shadcn/alert";
import { Button } from "~/components/shadcn/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/shadcn/dialog";
import { Input } from "~/components/shadcn/input";
import { Textarea } from "~/components/shadcn/textarea";

interface CreateGameDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreate: (title: string, description: string) => Promise<string | undefined>;
}

export default function CreateGameDialog({
	open,
	onOpenChange,
	onCreate,
}: CreateGameDialogProps) {
	const [newGameTitle, setNewGameTitle] = useState("");
	const [newGameDescription, setNewGameDescription] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	// TODO: ZOD validation
	const handleCreateGame = async () => {
		if (!newGameTitle.trim()) {
			setError("ゲームタイトルを入力してください");
			return;
		}

		try {
			setIsSubmitting(true);
			setError("");
			const gameId = await onCreate(newGameTitle, newGameDescription);
			if (gameId) {
				onOpenChange(false);
				setNewGameTitle("");
				setNewGameDescription("");
				navigate(`/dashboard/games/${gameId}/edit`);
			} else {
				setError("ゲームの作成に失敗しました");
			}
		} catch (err) {
			setError("ゲームの作成中にエラーが発生しました");
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" /> 新規作成
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>新しいゲームを作成</DialogTitle>
					<DialogDescription>
						新しいゲームプロジェクトを作成します。詳細は後で編集できます。
					</DialogDescription>
				</DialogHeader>

				{error && (
					<Alert variant="destructive" className="my-2">
						<AlertTitle>エラー</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<label htmlFor="title" className="text-sm font-medium">
							タイトル
						</label>
						<Input
							id="title"
							placeholder="ゲームタイトルを入力"
							value={newGameTitle}
							onChange={(e) => setNewGameTitle(e.target.value)}
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="description" className="text-sm font-medium">
							説明
						</label>
						<Textarea
							id="description"
							placeholder="ゲームの説明を入力"
							value={newGameDescription}
							onChange={(e) => setNewGameDescription(e.target.value)}
							rows={3}
						/>
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" disabled={isSubmitting}>
							キャンセル
						</Button>
					</DialogClose>
					<Button onClick={handleCreateGame} disabled={isSubmitting}>
						{isSubmitting ? "作成中..." : "作成"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
