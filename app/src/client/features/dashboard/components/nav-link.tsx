"use client";

import { Gamepad2, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
	const pathname = usePathname();

	return (
		<>
			<Link
				href="/dashboard"
				className={`
          flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
          ${
						pathname === "/dashboard"
							? "bg-secondary text-secondary-foreground"
							: "hover:bg-accent hover:text-accent-foreground"
					}
        `}
			>
				<Gamepad2 className="h-4 w-4" />
				<span>ゲーム一覧</span>
			</Link>

			<Link
				href="/dashboard/settings"
				className={`
          flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
          ${
						pathname === "/dashboard/settings"
							? "bg-secondary text-secondary-foreground"
							: "hover:bg-accent hover:text-accent-foreground"
					}
        `}
			>
				<Settings className="h-4 w-4" />
				<span>ユーザ設定</span>
			</Link>
		</>
	);
}
