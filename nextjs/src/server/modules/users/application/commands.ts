import {
  type UpdateProfileRequest,
  UserNotFoundError,
  type UserResponse,
  UserUnauthorizedError,
} from "@ptera/schema";
import type { FileUploadService } from "../../assets/infrastructure/file-upload";
import type { UserRepository } from "../infrastructure/repository";

export const createUserCommand = ({
  userRepository,
  fileUploadService,
}: {
  userRepository: UserRepository;
  fileUploadService: FileUploadService;
}) => {
  return {
    executeUploadAvatar: async (
      userId: number,
      file: File,
      currentUserId: number,
    ): Promise<string> => {
      const user = await userRepository.getById(userId);
      if (!user) {
        throw new UserNotFoundError(userId);
      }

      if (user.id !== currentUserId) {
        throw new UserUnauthorizedError();
      }

      const avatarUrl = await fileUploadService.uploadFile(file, "avatar");

      await userRepository.updateUserAvatar(user.id, avatarUrl);
      return avatarUrl;
    },

    executeUpdateProfile: async (
      userId: number,
      params: UpdateProfileRequest,
      currentUserId: number,
    ): Promise<UserResponse> => {
      const user = await userRepository.getById(userId);
      if (!user) {
        throw new UserNotFoundError(userId);
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
        throw new UserNotFoundError(userId);
      }

      return updatedUser;
    },
  };
};
