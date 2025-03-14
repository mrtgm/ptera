import type {
	AssetCharacterLinkRequest,
	AssetResponse,
	CreateAssetRequest,
	CreateCharacterRequest,
	UpdateAssetRequest,
	UpdateCharacterRequest,
} from "@/schemas/assets/dto";
import type { FileUploadService } from "../infrastructure/file-upload";
import type {
	AssetRepository,
	CharacterRepository,
} from "../infrastructure/repository";

export const createAssetCharacterCommands = ({
	assetRepository,
	characterRepository,
	fileUploadService,
}: {
	assetRepository: AssetRepository;
	characterRepository: CharacterRepository;
	fileUploadService: FileUploadService;
}) => {
	return {
		// アセットアップロード
		executeUploadAsset: async (
			file: File,
			params: CreateAssetRequest,
			userId: number,
		): Promise<AssetResponse> => {
			const fileUrl = await fileUploadService.uploadFile(
				file,
				params.assetType,
			);

			const asset = await assetRepository.createAsset({
				params: {
					name: params.name,
					assetType: params.assetType,
					url: fileUrl,
					metadata: params.metadata,
					userId,
				},
			});

			return {
				id: asset.id,
				assetType: asset.assetType,
				name: asset.name,
				url: asset.url,
				metadata: asset.metadata,
			};
		},

		// アセット更新
		executeUpdateAsset: async (
			assetId: number,
			params: UpdateAssetRequest,
			userId: number,
		): Promise<AssetResponse> => {
			// アセットを更新
			const asset = await assetRepository.updateAsset({
				params: {
					assetId,
					name: params.name,
					metadata: params.metadata,
				},
			});

			return {
				id: asset.id,
				assetType: asset.assetType,
				name: asset.name,
				url: asset.url,
				metadata: asset.metadata,
			};
		},

		executeDeleteAsset: async (assetId: number, userId: number) => {
			const asset = await assetRepository.getAssetById(assetId);
			if (!asset) {
				throw new Error("Asset not found");
			}

			await fileUploadService.deleteFile(asset.url);

			await assetRepository.deleteAsset({
				params: { assetId },
			});

			return { success: true };
		},

		// キャラクター作成
		executeCreateCharacter: async (
			params: CreateCharacterRequest,
			userId: number,
		) => {
			// キャラクターを作成
			const character = await characterRepository.createCharacter({
				params: {
					name: params.name,
					userId,
				},
			});

			return character;
		},

		// キャラクター更新
		executeUpdateCharacter: async (
			characterId: number,
			params: UpdateCharacterRequest,
			userId: number,
		) => {
			const character = await characterRepository.updateCharacter({
				params: {
					characterId,
					name: params.name,
				},
			});

			return character;
		},

		// キャラクター削除
		executeDeleteCharacter: async (characterId: number, userId: number) => {
			await characterRepository.deleteCharacter({
				params: { characterId },
			});

			return { success: true };
		},

		// キャラクターにアセットを関連付け
		executeLinkAssetToCharacter: async (
			characterId: number,
			params: AssetCharacterLinkRequest,
			userId: number,
		) => {
			await characterRepository.linkAssetToCharacter({
				params: {
					characterId,
					assetId: params.assetId,
				},
			});

			return { success: true };
		},

		// キャラクターからアセットの関連付けを解除
		executeUnlinkAssetFromCharacter: async (
			characterId: number,
			assetId: number,
			userId: number,
		) => {
			await characterRepository.unlinkAssetFromCharacter({
				params: {
					characterId,
					assetId,
				},
			});

			return { success: true };
		},
	};
};
