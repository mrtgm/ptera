"use client";

import { Header } from "~/client/features/dashboard/components/header";

import { NavLinks } from "@/client/features/dashboard/components/nav-link";
import {
	ChevronRight,
	Gamepad2,
	HomeIcon,
	LogOut,
	Settings,
	User,
} from "lucide-react";
import type { Metadata } from "next";
import { NavigationGuardProvider } from "next-navigation-guard";
import { DotGothic16 } from "next/font/google";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "~/client/components/shadcn/avatar";
import { Button } from "~/client/components/shadcn/button";
import { Separator } from "~/client/components/shadcn/separator";
import { useStore } from "~/client/stores";

import "../../../globals.css";

// export const meta: Metadata = { title: "Dashboard | Game Creator" };

const dotGothic16 = DotGothic16({
	weight: "400",
});

export default function Dashboard({ children }: { children: React.ReactNode }) {
	const userSlice = useStore.useSlice.user();
	const pathname = usePathname();

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((part) => part.charAt(0))
			.join("")
			.toUpperCase();
	};

	return (
		<html lang="ja">
			<body className={`${dotGothic16.className}  antialiased`}>
				<NavigationGuardProvider>
					<div className="min-h-screen flex flex-col">
						<Header />

						<div className="flex-1 flex">
							{/* Sidebar */}
							<div className="w-64 border-r bg-background p-4 hidden md:block">
								<div className="space-y-4">
									<div className="flex items-center gap-2 mb-8">
										<Avatar className="h-8 w-8">
											<AvatarImage
												src={userSlice?.currentUser?.avatarUrl}
												alt={userSlice?.currentUser?.name}
											/>
											<AvatarFallback>
												{userSlice?.currentUser?.name
													? getInitials(userSlice?.currentUser?.name)
													: "GC"}
											</AvatarFallback>
										</Avatar>
										<div className="space-y-1">
											<p className="text-sm font-medium leading-none">
												{userSlice?.currentUser?.name || "Game Creator"}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{userSlice?.currentUser?.email || ""}
											</p>
										</div>
									</div>

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
											<Link href="/logout">
												<LogOut className="mr-3 h-4 w-4" />
												<span>ログアウト</span>
											</Link>
										</Button>
									</div>
								</div>
							</div>

							{/* Main content */}
							<div className="flex-1 p-6 md:p-8">
								<div className="flex items-center mb-4">
									<h1 className="text-2xl font-bold tracking-tight">
										{pathname === "/dashboard" && "ゲーム一覧"}
										{pathname === "/dashboard/settings" && "アカウント設定"}
									</h1>

									{pathname.includes("/dashboard/games/") && (
										<div className="flex items-center text-sm text-muted-foreground ml-4">
											<Link href="/dashboard" className="hover:underline">
												ゲーム一覧
											</Link>
											<ChevronRight className="mx-1 h-4 w-4" />
											<span>Editor</span>
										</div>
									)}
								</div>

								<div className="mb-8">{children}</div>
							</div>
						</div>
					</div>
				</NavigationGuardProvider>
			</body>
		</html>
	);
}
