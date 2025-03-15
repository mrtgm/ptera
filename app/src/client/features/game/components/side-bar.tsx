"use client";

import { api } from "@/client/api";
import { Avatar } from "@/client/components/avatar";
import { Button } from "@/client/components/shadcn/button";
import { Separator } from "@/client/components/shadcn/separator";
import { useStore } from "@/client/stores";
import { HomeIcon, LogOut, User } from "lucide-react";
import Link from "next/link";
import { NavLinks } from "../../dashboard/components/nav-link";

export const SideBar = () => {
	const userSlice = useStore.useSlice.user();

	const handleLogout = async () => {
		await api.auth.logout();
		window.location.href = "/";
	};

	return (
		<div className="w-64 border-r bg-background p-4 hidden md:block">
			<div className="space-y-4">
				<UserNav />

				<div className="space-y-1">
					<NavLinks />
				</div>

				<Separator />

				<div className="space-y-1">
					<Link
						href="/"
						className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						<HomeIcon className="h-4 w-4" />
						<span>トップへ</span>
					</Link>

					<Link
						href={`/users/${userSlice?.currentUser?.id}`}
						className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						<User className="h-4 w-4" />
						<span>プロフィールへ</span>
					</Link>

					<Button
						variant="ghost"
						className="w-full justify-start px-3 text-destructive hover:text-destructive"
						asChild
					>
						<button
							onClick={handleLogout}
							type="button"
							className="cursor-pointer"
						>
							<LogOut className="mr-3 h-4 w-4" />
							<span>ログアウト</span>
						</button>
					</Button>
				</div>
			</div>
		</div>
	);
};

export const UserNav = () => {
	const userSlice = useStore.useSlice.user();
	return (
		<div className="flex items-center gap-2 mb-8">
			<Avatar username="Game Creator" avatarUrl="" />
			<div className="space-y-1">
				<p className="text-sm font-medium leading-none">
					{userSlice?.currentUser?.name || "No Name"}
				</p>
				<p className="text-xs text-muted-foreground truncate">
					{userSlice?.currentUser?.bio || ""}
				</p>
			</div>
		</div>
	);
};
