import { DashboardGamesContent } from "@/client/features/dashboard/components/game-list-wrapper";
import { ENV } from "@/configs/env";
import { AUTH_TOKEN_COOKIE_NAME } from "@/server/core/middleware/auth";
import { verify } from "hono/jwt";
import { Loader2 } from "lucide-react";
import { cookies } from "next/headers";
import { Suspense } from "react";

const getUserIdFromCookies = async () => {
	const cookieStore = await cookies();
	const signedCookie = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
	if (signedCookie) {
		const parsedToken = await verify(signedCookie, ENV.JWT_SECRET);
		return parsedToken.userId as number;
	}
	return null;
};

export default async function DashboardGamesPage() {
	const userId = await getUserIdFromCookies();

	return (
		<div className="space-y-6">
			<Suspense
				fallback={
					<div className="flex items-center justify-center min-h-[60vh]">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<span className="ml-2 text-muted-foreground">読み込み中...</span>
					</div>
				}
			>
				<DashboardGamesContent userId={userId} />
			</Suspense>
		</div>
	);
}
