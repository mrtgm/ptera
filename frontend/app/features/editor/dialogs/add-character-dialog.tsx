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

interface AddCharacterDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddCharacter: (name: string) => void;
}

export const AddCharacterDialog = ({
	open,
	onOpenChange,
	onAddCharacter,
}: AddCharacterDialogProps) => {
	const [newCharacterName, setNewCharacterName] = useState<string>("");

	const handleAddCharacter = () => {
		if (newCharacterName.trim()) {
			onAddCharacter(newCharacterName);
			setNewCharacterName("");
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>新しいキャラクターを追加</DialogTitle>
					<DialogDescription>
						キャラクターの名前を入力してください
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="name">キャラクター名</Label>
						<Input
							id="name"
							placeholder="キャラクター名を入力"
							value={newCharacterName}
							onChange={(e) => setNewCharacterName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && newCharacterName.trim()) {
									handleAddCharacter();
								}
							}}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="secondary" onClick={() => onOpenChange(false)}>
						キャンセル
					</Button>
					<Button
						onClick={handleAddCharacter}
						disabled={!newCharacterName.trim()}
					>
						追加
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddCharacterDialog;
