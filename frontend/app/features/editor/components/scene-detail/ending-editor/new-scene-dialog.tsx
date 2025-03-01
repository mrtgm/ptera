import { useState } from "react";
import { Button } from "~/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/shadcn/dialog";
import { Input } from "~/components/shadcn/input";
import { Label } from "~/components/shadcn/label";

interface NewSceneDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateScene: (title: string) => void;
}

export const NewSceneDialog: React.FC<NewSceneDialogProps> = ({
	isOpen,
	onClose,
	onCreateScene,
}) => {
	const [newSceneTitle, setNewSceneTitle] = useState("");

	const handleCreate = () => {
		if (newSceneTitle.trim()) {
			onCreateScene(newSceneTitle);
			setNewSceneTitle("");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={() => onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>新規シーン作成</DialogTitle>
					<DialogDescription>
						新しいシーンのタイトルを入力してください
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<Label htmlFor="new-scene-title" className="mb-2 block">
						シーンタイトル
					</Label>
					<Input
						id="new-scene-title"
						value={newSceneTitle}
						onChange={(e) => setNewSceneTitle(e.target.value)}
						placeholder="シーンタイトルを入力"
						autoFocus
					/>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						キャンセル
					</Button>
					<Button onClick={handleCreate} disabled={!newSceneTitle.trim()}>
						作成
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
