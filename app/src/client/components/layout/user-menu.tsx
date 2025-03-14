"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/client/components/shadcn/avatar";
import { Button } from "@/client/components/shadcn/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/client/components/shadcn/dropdown-menu";
import { useStore } from "@/client/stores";
import { ChevronDown, Gamepad2, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
	const userSlice = useStore.useSlice.user();

	const handleLogout = () => {
		userSlice.logout();
		window.location.href = "/";
	};

	const getInitials = (name = "") => {
		return name
			.split(" ")
			.map((part) => part.charAt(0))
			.join("")
			.toUpperCase();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="p-1">
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={userSlice.currentUser?.avatarUrl}
							alt={userSlice.currentUser?.name}
						/>
						<AvatarFallback>
							{userSlice.currentUser?.name
								? getInitials(userSlice.currentUser.name)
								: "GC"}
						</AvatarFallback>
					</Avatar>
					<ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<div className="px-3 py-2 text-sm">
					<p className="font-medium">
						{userSlice.currentUser?.name || "ユーザー"}
					</p>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href={`/users/${userSlice.currentUser?.id}`}>
						<User className="mr-2 h-4 w-4" />
						<span>マイプロフィール</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/dashboard">
						<Gamepad2 className="mr-2 h-4 w-4" />
						<span>マイゲーム</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/dashboard/settings">
						<Settings className="mr-2 h-4 w-4" />
						<span>設定</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>ログアウト</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
