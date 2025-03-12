import type { GameRepository } from "../infrastructure/repository";
// import { type CreateGameDto, mapGameToResponseDto } from "./dto";

// export const createCommand = ({
// 	gameRepository,
// }: {
// 	gameRepository: GameRepository;
// }) => {
// 	return {
// 		executeCreateGame: async (dto: CreateGameDto, userId: number) => {
// 			const game = await gameRepository.createGame({
// 				name: dto.name,
// 				description: dto.description,
// 				userId: userId,
// 			});
// 			await gameRepository.createEndScene(game.id, "サンプルシーン");
// 			return mapGameToResponseDto(game);
// 		},
// 	};
// };
