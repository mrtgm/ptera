import type { GameResources } from "../../assets/domain/resoucres";
import type { ResourceRepository } from "../../assets/infrastructure/repositories/resource";
import type { AssetRepository } from "../../assets/infrastructure/repository";
import type { GameListResponseDto } from "../../games/application/dto";
import type { GameRepository } from "../../games/infrastructure/repository";
import { UserNotFoundError } from "../../users/domain/error";
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
		): Promise<GameListResponseDto[]> => {
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
