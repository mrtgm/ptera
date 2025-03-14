import type { GameListResponse } from "~/schemas/games/dto";
import type { GameResources } from "../../../../schemas/assets/domain/resoucres";
import { UserNotFoundError } from "../../../../schemas/users/domain/error";
import type { ResourceRepository } from "../../assets/infrastructure/repositories/resource";
import type { AssetRepository } from "../../assets/infrastructure/repository";
import type { GameRepository } from "../../games/infrastructure/repository";
import type { UserRepository } from "../../users/infrastructure/repository";

export const createDashboardQuery = ({
	userRepository,
	gameRepository,
	resourceRepository,
}: {
	userRepository: UserRepository;
	gameRepository: GameRepository;
	resourceRepository: ResourceRepository;
}) => {
	return {
		executeGetMyGames: async (
			currentUserId: number,
		): Promise<GameListResponse[]> => {
			const games = await gameRepository.getGamesByUserId(currentUserId);
			const user = await userRepository.getById(currentUserId);

			if (!user) {
				throw new UserNotFoundError("");
			}

			return games.map((game) => ({
				...game,
				userPublicId: user.publicId,
				username: user.name,
				userAvatarUrl: user.avatarUrl,
			}));
		},

		executeGetMyResources: async (
			currentUserId: number,
		): Promise<GameResources> => {
			const assets = await resourceRepository.getResource(currentUserId);
			return assets;
		},
	};
};
