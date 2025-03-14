import { UserNotFoundError } from "../../../../schemas/users/domain/error";
import type { UserResponse } from "../../../../schemas/users/dto";
import type { UserRepository } from "../infrastructure/repository";

export const createUserQuery = ({
	userRepository,
}: {
	userRepository: UserRepository;
}) => {
	return {
		executeGetUser: async (userPublicId: string): Promise<UserResponse> => {
			const user = await userRepository.getByPublicId(userPublicId);
			if (!user) {
				throw new UserNotFoundError(userPublicId);
			}
			return {
				id: user.id,
				publicId: user.publicId,
				name: user.name,
				bio: user.bio,
				avatarUrl: user.avatarUrl,
				jwtSub: user.jwtSub,
			};
		},
	};
};
