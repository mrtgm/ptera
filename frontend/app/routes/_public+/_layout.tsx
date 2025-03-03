import { Link, Outlet, useLocation } from "@remix-run/react";
import { useState } from "react";
import { useStore } from "~/stores";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "~/components/shadcn/avatar";

import { Button } from "~/components/shadcn/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/shadcn/dropdown-menu";
import { Input } from "~/components/shadcn/input";
import { Separator } from "~/components/shadcn/separator";
import { Sheet, SheetContent, SheetTrigger } from "~/components/shadcn/sheet";

// lucide icons
import {
	ChevronDown,
	Gamepad2,
	Github,
	Home,
	LogIn,
	LogOut,
	Menu,
	Search,
	Settings,
	Twitter,
	User,
} from "lucide-react";
import { Logo } from "~/components/logo";

export default function MainLayout() {
	const location = useLocation();
	const { isAuthenticated, currentUser, logout } = useStore((state) => ({
		isAuthenticated: state.isAuthenticated,
		currentUser: state.currentUser,
		logout: state.logout,
	}));

	const [searchQuery, setSearchQuery] = useState("");

	const isHomePage = location.pathname === "/";

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/games?search=${encodeURIComponent(searchQuery)}`;
		}
	};

	const handleLogout = () => {
		logout();
		window.location.href = "/";
	};

	const getInitials = (name = "") => {
		return name
			.split(" ")
			.map((part) => part.charAt(0))
			.join("")
			.toUpperCase();
	};

	// フッターのリンク
	const footerLinks = [
		{ name: "ホーム", href: "/" },
		{ name: "ゲーム一覧", href: "/games" },
		{ name: "利用規約", href: "/terms" },
		{ name: "プライバシーポリシー", href: "/privacy" },
	];

	return (
		<div className="flex flex-col min-h-screen">
			{/* ヘッダー */}
			<header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4 py-3 flex items-center justify-between">
					{/* ロゴとモバイルメニュー */}
					<div className="flex items-center">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="md:hidden mr-2">
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-72">
								<div className="flex flex-col h-full">
									<div className="py-4">
										<Link to="/" className="text-xl font-bold">
											<Logo />
										</Link>
									</div>

									<nav className="flex-1 py-4">
										<ul className="space-y-2">
											<li>
												<Link
													to="/"
													className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
												>
													<Home className="mr-3 h-5 w-5" />
													<span>ホーム</span>
												</Link>
											</li>
											<li>
												<Link
													to="/games"
													className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
												>
													<Gamepad2 className="mr-3 h-5 w-5" />
													<span>ゲーム一覧</span>
												</Link>
											</li>

											<Separator className="my-4" />

											{isAuthenticated ? (
												<>
													<li>
														<Link
															to={`/users/${currentUser?.id}`}
															className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
														>
															<User className="mr-3 h-5 w-5" />
															<span>マイプロフィール</span>
														</Link>
													</li>
													<li>
														<Link
															to="/dashboard"
															className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
														>
															<Gamepad2 className="mr-3 h-5 w-5" />
															<span>マイゲーム</span>
														</Link>
													</li>
													<li>
														<Link
															to="/dashboard/settings"
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
															to="/login"
															className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
														>
															<LogIn className="mr-3 h-5 w-5" />
															<span>ログイン</span>
														</Link>
													</li>
													<li>
														<Link
															to="/register"
															className="flex items-center py-2 px-3 rounded-md hover:bg-accent"
														>
															<User className="mr-3 h-5 w-5" />
															<span>アカウント作成</span>
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
							</SheetContent>
						</Sheet>

						<Link to="/" className="text-xl font-bold">
							<Logo />
						</Link>
					</div>

					{/* デスクトップナビゲーション */}
					<nav className="hidden md:flex items-center space-x-6">
						<Link
							to="/games"
							className="text-sm font-medium hover:text-primary ml-4"
						>
							ゲーム一覧
						</Link>
					</nav>

					{/* 検索フォーム */}
					<div className="hidden md:block flex-grow max-w-md mx-6">
						<form onSubmit={handleSearch} className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="ゲームを検索..."
								className="pl-10 w-full"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</form>
					</div>

					{/* ユーザーメニュー */}
					<div className="flex items-center space-x-4">
						{isAuthenticated ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="p-1">
										<Avatar className="h-8 w-8">
											<AvatarImage
												src={currentUser?.avatarUrl}
												alt={currentUser?.name}
											/>
											<AvatarFallback>
												{currentUser?.name
													? getInitials(currentUser.name)
													: "GC"}
											</AvatarFallback>
										</Avatar>
										<ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<div className="px-3 py-2 text-sm">
										<p className="font-medium">
											{currentUser?.name || "ユーザー"}
										</p>
										<p className="text-muted-foreground truncate">
											{currentUser?.email}
										</p>
									</div>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link to={`/users/${currentUser?.id}`}>
											<User className="mr-2 h-4 w-4" />
											<span>マイプロフィール</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link to="/dashboard">
											<Gamepad2 className="mr-2 h-4 w-4" />
											<span>マイゲーム</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link to="/dashboard/settings">
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
						) : (
							<>
								<Button variant="ghost" asChild>
									<Link to="/login">ログイン</Link>
								</Button>
								<Button asChild>
									<Link to="/register">アカウント作成</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			</header>

			{/* モバイル用検索バー */}
			<div className="md:hidden border-b">
				<div className="container mx-auto px-4 py-2">
					<form onSubmit={handleSearch} className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="ゲームを検索..."
							className="pl-10 w-full"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</form>
				</div>
			</div>

			{/* メインコンテンツ */}
			<main className="flex-grow">
				<Outlet />
			</main>

			{/* フッター */}
			<footer className="border-t bg-muted/40">
				<div className="container mx-auto px-4 py-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div>
							<h3 className="text-lg font-bold mb-4">Ptera</h3>
							<p className="text-sm text-muted-foreground">
								オリジナルのビジュアルノベルやアドベンチャーゲームを簡単に作成して共有できるプラットフォーム
							</p>
						</div>

						<div>
							<h3 className="text-lg font-bold mb-4">リンク</h3>
							<ul className="space-y-2">
								{footerLinks.map((link) => (
									<li key={link.href}>
										<Link
											to={link.href}
											className="text-sm text-muted-foreground hover:text-foreground"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-bold mb-4">フォロー</h3>
							<div className="flex space-x-4">
								<a
									href="https://github.com"
									className="text-muted-foreground hover:text-foreground"
								>
									<Github className="h-5 w-5" />
								</a>
								<a
									href="https://twitter.com"
									className="text-muted-foreground hover:text-foreground"
								>
									<Twitter className="h-5 w-5" />
								</a>
							</div>
						</div>
					</div>

					<Separator className="my-6" />

					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-sm text-muted-foreground">
							&copy; 2025 Ptera. All rights reserved.
						</p>
						<div className="flex space-x-4 mt-4 md:mt-0">
							<Link
								to="/terms"
								className="text-sm text-muted-foreground hover:text-foreground"
							>
								利用規約
							</Link>
							<Link
								to="/privacy"
								className="text-sm text-muted-foreground hover:text-foreground"
							>
								プライバシーポリシー
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
