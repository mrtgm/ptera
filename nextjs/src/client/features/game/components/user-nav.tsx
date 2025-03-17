import { Avatar } from "@/client/components/avatar";
import { useStore } from "@/client/stores";

export const UserNav = () => {
  const userSlice = useStore.useSlice.user();
  return (
    <div className="flex items-center gap-2 mb-8">
      {userSlice.isInitialized ? (
        <>
          <Avatar
            username={userSlice?.currentUser?.name}
            avatarUrl={userSlice?.currentUser?.avatarUrl}
          />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {userSlice?.currentUser?.name || "No Name"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userSlice?.currentUser?.bio || ""}
            </p>
          </div>
        </>
      ) : (
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      )}
    </div>
  );
};
