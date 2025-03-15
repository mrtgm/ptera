import { api } from "@/client/api";
import { ProfileForm } from "@/client/features/dashboard/components/profile-form";
import { ENV } from "@/configs/env";
import { AUTH_TOKEN_COOKIE_NAME } from "@/server/core/middleware/auth";
import { verify } from "hono/jwt";
import { cookies } from "next/headers";

const getUser = async () => {
	const cookieStore = await cookies();
	const signedCookie = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
	if (signedCookie) {
		const parsedToken = await verify(signedCookie, ENV.JWT_SECRET);
		return await api.users.get(parsedToken.userId as number);
	}
	return null;
};

export function ProfileSectionSkeleton() {
	return (
		<div className="space-y-6">
			<div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
			<div className="space-y-4">
				<div className="h-64 bg-gray-200 rounded animate-pulse" />
			</div>
		</div>
	);
}

export default async function DashboardGamesPage() {
	const user = await getUser();

	if (!user) {
		return <ProfileSectionSkeleton />;
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold tracking-tight">アカウント設定</h1>
			<ProfileForm user={user} />
		</div>
	);
}
