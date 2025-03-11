import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/client/components/shadcn/alert";
import { Button } from "@/client/components/shadcn/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/client/components/shadcn/dialog";
import { DialogClose } from "@/client/components/shadcn/dialog";
import { type ReactNode, useState } from "react";

interface DeleteConfirmationDialogProps {
	title: string;
	description: string;
	alertDescription?: string;
	confirmDelete: () => void;
	children?: ReactNode;
}

export const DeleteConfirmationDialog = ({
	title,
	description,
	alertDescription,
	confirmDelete,
	children,
}: DeleteConfirmationDialogProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleConfirmDelete = () => {
		confirmDelete();
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					{children}
					{alertDescription && (
						<Alert className="mt-4" variant="destructive">
							<AlertTitle>注意</AlertTitle>
							<AlertDescription>{alertDescription}</AlertDescription>
						</Alert>
					)}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="secondary">キャンセル</Button>
					</DialogClose>
					<Button variant="destructive" onClick={handleConfirmDelete}>
						削除する
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export const useDeleteConfirmationDialog = () => {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const ConfirmDialog = ({
		title,
		description,
		alertDescription,
		confirmDelete,
		children,
	}: DeleteConfirmationDialogProps) => {
		return (
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						{children}
						{alertDescription && (
							<Alert className="mt-4" variant="destructive">
								<AlertTitle>注意</AlertTitle>
								<AlertDescription>{alertDescription}</AlertDescription>
							</Alert>
						)}
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="secondary">キャンセル</Button>
						</DialogClose>
						<Button variant="destructive" onClick={confirmDelete}>
							削除する
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	};

	return { ConfirmDialog, setDeleteDialogOpen, deleteDialogOpen };
};
