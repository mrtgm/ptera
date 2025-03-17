import { api } from "@/client/api";
import { guard } from "@/client/features/auth/guard";
import { ProfileForm } from "@/client/features/dashboard/components/profile-form";

export default async function DashboardGamesPage() {
	await guard();
	const user = await api.auth.me();

	if (!user) {
		return (
			<div className="space-y-6">
				<div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
				<div className="space-y-4">
					<div className="h-64 bg-gray-200 rounded animate-pulse" />
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold tracking-tight">アカウント設定</h1>
			<ProfileForm user={user} />
		</div>
	);
}
