import { Gamepad2 } from "lucide-react";

export const Empty = () => {
  return (
    <div className="text-center py-12">
      <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">
        ゲームが見つかりませんでした
      </h2>
      <p className="text-muted-foreground">検索条件を変更してください</p>
    </div>
  );
};
