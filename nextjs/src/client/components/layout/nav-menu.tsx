"use client";

import { Logo } from "@/client/components/logo";
import { Separator } from "@/client/components/shadcn/separator";
import { useStore } from "@/client/stores";
import { Gamepad2, Home, LogIn, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

export const NavMenu = () => {
  const userSlice = useStore.useSlice.user();

  const handleLogout = () => {
    userSlice.logout();
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="py-4">
        <Link href="/" className="text-xl font-bold">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
            >
              <Home className="mr-3 h-5 w-5" />
              <span>ホーム</span>
            </Link>
          </li>
          <li>
            <Link
              href="/games"
              className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
            >
              <Gamepad2 className="mr-3 h-5 w-5" />
              <span>ゲーム一覧</span>
            </Link>
          </li>

          <Separator className="my-4" />

          {userSlice.isAuthenticated ? (
            <>
              <li>
                <Link
                  href={`/users/${userSlice.currentUser?.id}`}
                  className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
                >
                  <User className="mr-3 h-5 w-5" />
                  <span>マイプロフィール</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
                >
                  <Gamepad2 className="mr-3 h-5 w-5" />
                  <span>マイゲーム</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
                >
                  <Settings className="mr-3 h-5 w-5" />
                  <span>設定</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center py-2 px-3 rounded-md hover:bg-accent"
                  type="button"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>ログアウト</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
                >
                  <LogIn className="mr-3 h-5 w-5" />
                  <span>ログイン</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="py-4">
        <p className="text-center text-xs text-muted-foreground mt-4">
          &copy; 2025 Ptera
        </p>
      </div>
    </div>
  );
};
