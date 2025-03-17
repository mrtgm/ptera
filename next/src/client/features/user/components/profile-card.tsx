"use client";

import { Avatar } from "@/client/components/avatar";
import { Button } from "@/client/components/shadcn/button";
import { Card, CardContent } from "@/client/components/shadcn/card";
import { useStore } from "@/client/stores";
import type { UserResponse } from "@ptera/schema";
import { Eye, Gamepad2, Mail, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const UserProfileCard = ({
  user,
  totalPlayCount,
  totalLikeCount,
  gameCount,
}: {
  user: UserResponse;
  totalPlayCount: number | undefined;
  totalLikeCount: number | undefined;
  gameCount: number | undefined;
}) => {
  const userSlice = useStore.useSlice.user();
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    if (userSlice.isAuthenticated && userSlice.currentUser) {
      setIsCurrentUser(userSlice.currentUser.id === user.id);
    } else {
      setIsCurrentUser(false);
    }
  }, [user, userSlice.currentUser, userSlice.isAuthenticated]);

  // TODO: Implement message feature
  const handleSendMessage = () => {
    alert("メッセージ機能は現在開発中です");
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar
            username={user.name}
            avatarUrl={user.avatarUrl}
            className="h-24 w-24"
          />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground">
              <div className="bg-green-50/50 rounded-lg p-3 text-center text-green-600">
                <Eye className="h-5 w-5 mx-auto mb-1" />
                <p className="text-2xl font-bold">{totalPlayCount ?? 0}</p>
                <p className="text-xs">総プレイ数</p>
              </div>
              <div className="bg-orange-50/50 rounded-lg p-3 text-center text-orange-400">
                <ThumbsUp className="h-5 w-5 mx-auto mb-1" />
                <p className="text-2xl font-bold">{totalLikeCount ?? 0}</p>
                <p className="text-xs">総いいね数</p>
              </div>
              <div className="flex items-center">
                <Gamepad2 className="h-4 w-4 mr-1" />
                <span>ゲーム数: {gameCount}</span>
              </div>
            </div>

            {user.bio && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">{user.bio}</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {isCurrentUser ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/settings">プロフィールを編集</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={handleSendMessage}>
                  <Mail className="h-4 w-4 mr-2" />
                  メッセージを送る
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
