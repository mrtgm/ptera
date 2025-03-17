"use client";
import { Logo } from "@/client/components/logo";
import { Button } from "@/client/components/shadcn/button";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@/client/components/shadcn/sheet";
import { useStore } from "@/client/stores";
import { Loader2, Menu } from "lucide-react";
import Link from "next/link";
import { NavMenu } from "./nav-menu";
import { SearchForm } from "./search-form";
import { UserMenu } from "./user-menu";

export const Header = () => {
	const userSlice = useStore.useSlice.user();

	return (
		<header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-[64px]">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<div className="flex items-center">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden mr-2">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-72">
							<NavMenu />
						</SheetContent>
					</Sheet>
					<Link href="/" className="text-xl font-bold">
						<Logo />
					</Link>
				</div>
				{/* デスクトップナビゲーション */}
				<nav className="hidden md:flex items-center space-x-6">
					<Link
						href="/games"
						className="text-sm font-medium hover:text-primary ml-4"
					>
						ゲーム一覧
					</Link>
				</nav>
				<div className="hidden md:block flex-grow max-w-md mx-6">
					<SearchForm />
				</div>
				<div className="flex items-center space-x-4">
					{!userSlice.isInitialized ? (
						<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
					) : userSlice.isAuthenticated ? (
						<UserMenu />
					) : (
						<Button variant="ghost" asChild>
							<Link href="/login">ログイン</Link>
						</Button>
					)}
				</div>
			</div>
		</header>
	);
};
