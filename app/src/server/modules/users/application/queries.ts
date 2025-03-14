import { UserNotFoundError } from "../../../../schemas/users/domain/error";
import type { UserResponse } from "../../../../schemas/users/dto";
import type { UserRepository } from "../infrastructure/repository";

export const createUserQuery = ({
	userRepository,
}: {
	userRepository: UserRepository;
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
	};
};
