"use client";

import { api } from "@/client/api";
import { Avatar } from "@/client/components/avatar";
import { useAuthDialog } from "@/client/components/diaogs/auth-dialog";
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
import { Textarea } from "@/client/components/shadcn/textarea";
import { useStore } from "@/client/stores";
import type { Comment } from "@ptera/schema";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const GameCommentSection = ({
  gameId,
  initialComments = [],
}: { gameId: number; initialComments: Comment[] | null }) => {
  const router = useRouter();
  const userSlice = useStore.useSlice.user();
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { AuthDialog, setAuthDialogOpen } = useAuthDialog();

  const handleSubmitComment = async () => {
    if (!userSlice.isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    if (!commentText.trim()) return;

    try {
      setIsSubmitting(true);

      await api.games.createComment(gameId, { content: commentText });
      await fetchComments();
      setCommentText("");
      router.refresh();
    } catch (err) {
      console.error("Failed to submit comment:", err);
      setError("コメントの投稿に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const comment = await api.games.getComments(gameId);
      if (comment) {
        setComments(comment || []);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError("コメントの読み込みに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (commentId: number) => {
    setCommentToDelete(commentId);
    setIsDeleteDialogOpen(true);
  };

  const deleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await api.games.deleteComment(gameId, commentToDelete);
      await fetchComments();
      router.refresh();
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setError("コメントの削除に失敗しました");
    } finally {
      setIsDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: ja,
    });
  };

  return (
    <div>
      <AuthDialog message="コメントするにはログインしてください" />
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>コメントを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。コメントを完全に削除してもよろしいですか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteComment}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <h2 className="text-xl font-bold mb-4">コメント</h2>

      <div className="mb-6">
        <Textarea
          placeholder={
            userSlice.isAuthenticated
              ? "コメントを入力してください..."
              : "コメントするにはログインしてください"
          }
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={!userSlice.isAuthenticated || isSubmitting}
          className="mb-2"
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitComment}
            disabled={
              !userSlice.isAuthenticated || !commentText.trim() || isSubmitting
            }
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            投稿する
          </Button>
        </div>
      </div>

      {error && <p className="text-destructive mb-4">{error}</p>}

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              コメントを読み込み中...
            </span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">まだコメントはありません</p>
            <p className="text-sm text-muted-foreground">
              最初のコメントを投稿してみましょう！
            </p>
          </div>
        ) : (
          comments
            .sort((a, b) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            })
            .map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 relative">
                <div className="flex items-center mb-2">
                  <Avatar
                    className="h-6 w-6 mr-2"
                    username={comment.username}
                    avatarUrl={comment.avatarUrl}
                  />
                  <Link
                    href={`/users/${comment.userId}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {comment.username}
                  </Link>
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>

                {userSlice.isAuthenticated &&
                  userSlice.currentUser?.id === comment.userId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(comment.id)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="コメントを削除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
              </div>
            ))
        )}
      </div>
    </div>
  );
};
