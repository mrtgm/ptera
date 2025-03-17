import { api } from "@/client/api";
import { Alert, AlertDescription } from "@/client/components/shadcn/alert";
import { AlertTriangle } from "lucide-react";
import { UserGameList } from "./game-list";
import { UserProfileCard } from "./profile-card";

export const UserProfileDetail = async ({
  userId,
}: {
  userId: number;
}) => {
  const [user, userGames] = await Promise.all([
    api.users.get(userId),
    api.users.getGames(userId),
  ]);

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertDescription>ユーザーが見つかりません</AlertDescription>
      </Alert>
    );
  }

  const totalPlayCount = userGames?.reduce(
    (sum, game) => sum + (game.playCount || 0),
    0,
  );

  const totalLikeCount = userGames?.reduce(
    (sum, game) => sum + (game.likeCount || 0),
    0,
  );

  return (
    <>
      <UserProfileCard
        user={user}
        totalPlayCount={totalPlayCount}
        totalLikeCount={totalLikeCount}
        gameCount={userGames?.length}
      />

      <h2 className="text-xl font-semibold mb-4">{user.name}のゲーム</h2>

      <UserGameList games={userGames} />
    </>
  );
};
