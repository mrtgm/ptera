import { honoWithHook } from "../../../lib/hono";
import {
	errorResponse,
	successWithDataResponse,
	successWithoutDataResponse,
} from "../../../shared/schema/response";
import { createAssetCharacterCommands } from "../application/command";
import type { CreateAssetRequest } from "../application/dto";
import { FileUploadService } from "../infrastructure/file-upload";
import {
	AssetRepository,
	CharacterRepository,
} from "../infrastructure/repository";
import { errorHandler } from "./error-handler";
import { assetRouteConfigs, characterRouteConfigs } from "./routes";

const assetRoutes = honoWithHook();

const assetRepository = new AssetRepository();
const characterRepository = new CharacterRepository();
const fileUploadService = new FileUploadService();

// コマンドの作成
const commands = createAssetCharacterCommands({
	assetRepository,
	characterRepository,
	fileUploadService,
});

// アセットアップロード
assetRoutes.openapi(assetRouteConfigs.uploadAsset, async (c) => {
	const formData = await c.req.formData();
	const file = formData.get("file") as File;
	const assetType = formData.get(
		"assetType",
	) as CreateAssetRequest["assetType"];
	const name = formData.get("name") as string;
	const metadataStr = formData.get("metadata") as string | null;

	let metadata = {};
	if (metadataStr) {
		try {
			metadata = JSON.parse(metadataStr);
		} catch (e) {
			return errorResponse(c, 400, "badRequest", "warn", "asset", {
				metadata: "invalid json",
			});
		}
	}

	const userId = c.get("user")?.id;
	if (!userId) {
		return errorResponse(c, 401, "unauthorized", "warn", "user", {
			userId: "required",
		});
	}

	const result = await commands.executeUploadAsset(
		file,
		{ assetType, name, metadata },
		userId,
	);

	return successWithDataResponse(c, result);
});

// アセット更新
assetRoutes.openapi(assetRouteConfigs.updateAsset, async (c) => {
	const assetId = c.req.valid("param").assetId;
	const dto = c.req.valid("json");
	const userId = c.get("user")?.id;
	if (!userId) {
		return errorResponse(c, 401, "unauthorized", "warn", "user", {
			userId: "required",
		});
	}

	const result = await commands.executeUpdateAsset(assetId, dto, userId);
	return successWithDataResponse(c, result);
});

// アセット削除
assetRoutes.openapi(assetRouteConfigs.deleteAsset, async (c) => {
	const assetId = c.req.valid("param").assetId;
	const userId = c.get("user")?.id;
	if (!userId) {
		return errorResponse(c, 401, "unauthorized", "error");
	}

	await commands.executeDeleteAsset(assetId, userId);
	return successWithoutDataResponse(c);
});

assetRoutes.onError(errorHandler);

const characterRoutes = honoWithHook();

characterRoutes.openapi(characterRouteConfigs.createCharacter, async (c) => {
	const dto = c.req.valid("json");
	const userId = c.get("user")?.id;
	if (!userId) {
		return errorResponse(c, 401, "unauthorized", "error");
	}

	const result = await commands.executeCreateCharacter(dto, userId);
	return successWithDataResponse(c, result);
});

characterRoutes.openapi(characterRouteConfigs.updateCharacter, async (c) => {
	const characterId = c.req.valid("param").characterId;
	const dto = c.req.valid("json");
	const userId = c.get("user")?.id;
	if (!userId) {
		return errorResponse(c, 401, "unauthorized", "error");
	}

	const result = await commands.executeUpdateCharacter(
		characterId,
		dto,
		userId,
	);
	return successWithDataResponse(c, result);
});

characterRoutes.openapi(characterRouteConfigs.deleteCharacter, async (c) => {
	const characterId = c.req.valid("param").characterId;
	const userId = c.get("user")?.id;
	if (!userId) {
		return errorResponse(c, 401, "unauthorized", "error");
	}

	await commands.executeDeleteCharacter(characterId, userId);
	return successWithoutDataResponse(c);
});

// キャラクターにアセットを関連付け
characterRoutes.openapi(
	characterRouteConfigs.linkAssetToCharacter,
	async (c) => {
		const characterId = c.req.valid("param").characterId;
		const dto = c.req.valid("json");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}

		await commands.executeLinkAssetToCharacter(characterId, dto, userId);
		return successWithoutDataResponse(c);
	},
);

// キャラクターからアセットの関連付けを解除
characterRoutes.openapi(
	characterRouteConfigs.unlinkAssetFromCharacter,
	async (c) => {
		const { characterId, assetId } = c.req.valid("param");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}

		await commands.executeUnlinkAssetFromCharacter(
			characterId,
			assetId,
			userId,
		);
		return successWithoutDataResponse(c);
	},
);

characterRoutes.onError(errorHandler);

export { assetRoutes, characterRoutes };
