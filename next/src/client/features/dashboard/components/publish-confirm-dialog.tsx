"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/client/components/shadcn/alert-dialog";
import { Button } from "@/client/components/shadcn/button";

export function PublishStatusDialog({
  open,
  onOpenChange,
  onConfirm,
  gameTitle,
  currentStatus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  gameTitle: string;
  currentStatus: string;
}) {
  const isPublishing = currentStatus !== "published";

  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isPublishing
              ? "ゲームを公開しますか？"
              : "ゲームを非公開にしますか？"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isPublishing
              ? `「${gameTitle}」を公開すると、他のユーザーがプレイできるようになります。`
              : `「${gameTitle}」を非公開にすると、他のユーザーはプレイできなくなります。`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={isPublishing ? "default" : "outline"}
              onClick={handleConfirm}
            >
              {isPublishing ? "公開する" : "非公開にする"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
