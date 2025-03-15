import { api } from "@/client/api";
import { DashboardGamesList } from "./game-list";

export const DashboardGamesContent = async ({
	userId,
}: {
	userId: number | null;
}) => {
	if (userId === null) {
		return <DashboardGamesList userGames={[]} />;
	}
	const userGames = await api.users.getGames(userId);
	return <DashboardGamesList userGames={userGames} />;
};
