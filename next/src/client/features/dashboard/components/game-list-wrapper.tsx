import { api } from "@/client/api";
import { DashboardGamesList } from "./game-list";

export const DashboardGamesContent = async () => {
  const userGames = (await api.auth.getMyGames()) ?? [];
  return <DashboardGamesList userGames={userGames} />;
};
