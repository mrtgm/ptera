import { db } from "@/server/shared/infrastructure/db";
import {
	UserNotFoundError,
	UserUnauthorizedError,
} from "../../../../schemas/users/domain/error";
import type {
	UpdateProfileRequest,
	UserResponse,
} from "../../../../schemas/users/dto";
import type { UserRepository } from "../infrastructure/repository";

export const createUserCommand = ({
	userRepository,
}: {
	userRepository: UserRepository;
}) => {
	return {
		executeUpdateProfile: async (
			userPublicId: string,
			params: UpdateProfileRequest,
			currentUserId: number,
		): Promise<UserResponse> => {
			const user = await userRepository.getByPublicId(userPublicId);
			if (!user) {
				throw new UserNotFoundError(userPublicId);
			}

			if (user.id !== currentUserId) {
				throw new UserUnauthorizedError();
			}

			await userRepository.updateUserProfile(
				user.id,
				params.name,
				params.bio,
				params.avatarUrl,
			);

			const updatedUser = await userRepository.getById(user.id);
			if (!updatedUser) {
				throw new UserNotFoundError(userPublicId);
			}

			return updatedUser;
		},
	};
};
