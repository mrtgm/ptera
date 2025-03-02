import {
	Link,
	type MetaFunction,
	NavLink,
	Outlet,
	useLocation,
} from "@remix-run/react";
import { Header } from "~/features/dashboard/components/header";

import {
	ChevronRight,
	Gamepad2,
	HomeIcon,
	LogOut,
	Settings,
	User,
} from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "~/components/shadcn/avatar";
import { Button } from "~/components/shadcn/button";
import { Separator } from "~/components/shadcn/separator";
import { useStore } from "~/stores";

export const meta: MetaFunction = () => {
	return [{ title: "Dashboard | Game Creator" }];
};

export default function Dashboard() {
	const userSlice = useStore.useSlice.user();
	const location = useLocation();

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((part) => part.charAt(0))
			.join("")
			.toUpperCase();
	};

	return (
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
							<NavLink
								to="/dashboard"
								end
								prefetch="intent"
								className={({ isActive }) => `
                flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${
									isActive
										? "bg-secondary text-secondary-foreground"
										: "hover:bg-accent hover:text-accent-foreground"
								}
              `}
							>
								<Gamepad2 className="h-4 w-4" />
								<span>ゲーム一覧</span>
							</NavLink>

							<NavLink
								to="/dashboard/settings"
								prefetch="intent"
								className={({ isActive }) => `
                flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${
									isActive
										? "bg-secondary text-secondary-foreground"
										: "hover:bg-accent hover:text-accent-foreground"
								}
              `}
							>
								<Settings className="h-4 w-4" />
								<span>ユーザ設定</span>
							</NavLink>
						</div>

						<Separator />

						<div className="space-y-1">
							<Link
								to="/"
								className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
							>
								<HomeIcon className="h-4 w-4" />
								<span>トップへ</span>
							</Link>

							<Link
								to={`/users/${userSlice?.currentUser?.id}`}
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
								<Link to="/logout">
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
							{location.pathname === "/dashboard" && "ゲーム一覧"}
							{location.pathname === "/dashboard/settings" && "アカウント設定"}
						</h1>

						{location.pathname.includes("/dashboard/games/") && (
							<div className="flex items-center text-sm text-muted-foreground ml-4">
								<Link to="/dashboard" className="hover:underline">
									ゲーム一覧
								</Link>
								<ChevronRight className="mx-1 h-4 w-4" />
								<span>Editor</span>
							</div>
						)}
					</div>

					<div className="mb-8">
						<Outlet key={location.pathname} />
					</div>
				</div>
			</div>
		</div>
	);
}
