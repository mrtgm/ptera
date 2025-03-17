import {
	type GameListResponse,
	UserNotFoundError,
	type UserResponse,
} from "@ptera/schema";
import type { GameRepository } from "../../games/infrastructure/repository";
import type { UserRepository } from "../infrastructure/repository";

export const createUserQuery = ({
	userRepository,
	gameRepostiory,
}: {
	userRepository: UserRepository;
	gameRepostiory: GameRepository;
}) => {
	return {
		executeGetUser: async (userId: number): Promise<UserResponse> => {
			const user = await userRepository.getById(userId);
			if (!user) {
				throw new UserNotFoundError(userId);
			}
			return {
				id: user.id,
				name: user.name,
				bio: user.bio,
				avatarUrl: user.avatarUrl,
				jwtSub: user.jwtSub,
			};
		},
		executeGetUserGames: async (
			userId: number,
		): Promise<GameListResponse[]> => {
			const user = await userRepository.getById(userId);
			if (!user) {
				throw new UserNotFoundError(userId);
			}
			const games = await gameRepostiory.getGamesByUserId(userId);

			return games.map((game) => ({
				...game,
				userId: user.id,
				username: user.name,
				userAvatarUrl: user.avatarUrl,
			}));
		},
	};
};
