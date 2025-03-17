import { UserProfileDetail } from "@/client/features/user/components/user-detail";
import { Loader2 } from "lucide-react";
import { Suspense, use } from "react";

export default function UserProfilePage({
  params,
}: {
  params: Promise<{
    userId: string;
  }>;
}) {
  const p = use(params);
  const userId = Number.parseInt(p.userId, 10);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              ユーザー情報を読み込み中...
            </span>
          </div>
        }
      >
        <UserProfileDetail userId={userId} />
      </Suspense>
    </div>
  );
}
