import type { CreateAssetRequest } from "@ptera/schema";
import { honoWithHook } from "../../../lib/hono";
import {
  errorResponse,
  successWithDataResponse,
  successWithoutDataResponse,
} from "../../../shared/schema/response";
import { createAssetCharacterCommands } from "../application/command";
import { FileUploadService } from "../infrastructure/file-upload";
import {
  AssetRepository,
  CharacterRepository,
} from "../infrastructure/repository";
import { errorHandler } from "./error-handler";
import { assetRouteConfigs, characterRouteConfigs } from "./routes";

const assetRepository = new AssetRepository();
const characterRepository = new CharacterRepository();
const fileUploadService = new FileUploadService();

const commands = createAssetCharacterCommands({
  assetRepository,
  characterRepository,
  fileUploadService,
});

const assetRoutes = honoWithHook();

assetRoutes
  .openapi(assetRouteConfigs.uploadAsset, async (c) => {
    const body = await c.req.parseBody();
    const file = body.file as File;
    const assetType = body.assetType as CreateAssetRequest["assetType"];
    const name = body.name as CreateAssetRequest["name"];
    const metadataStr = body.metadata as string;
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
      { file, assetType, name, metadata },
      userId,
    );

    return successWithDataResponse(c, result);
  })
  .openapi(assetRouteConfigs.updateAsset, async (c) => {
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
  })
  .openapi(assetRouteConfigs.deleteAsset, async (c) => {
    const assetId = c.req.valid("param").assetId;
    const userId = c.get("user")?.id;
    if (!userId) {
      return errorResponse(c, 401, "unauthorized", "warn", "user", {
        userId: "required",
      });
    }

    await commands.executeDeleteAsset(assetId, userId);
    return successWithoutDataResponse(c);
  })
  .openapi(assetRouteConfigs.unlinkAssetFromGame, async (c) => {
    const { assetId, gameId } = c.req.valid("param");
    const userId = c.get("user")?.id;
    if (!userId) {
      return errorResponse(c, 401, "unauthorized", "warn", "user", {
        userId: "required",
      });
    }
    await commands.executeUnlinkAssetFromGame(assetId, gameId);
    return successWithoutDataResponse(c);
  });

assetRoutes.onError(errorHandler);

const characterRoutes = honoWithHook();

characterRoutes
  .openapi(characterRouteConfigs.createCharacter, async (c) => {
    const dto = c.req.valid("json");
    const userId = c.get("user")?.id;
    if (!userId) {
      return errorResponse(c, 401, "unauthorized", "warn", "user", {
        userId: "required",
      });
    }
    const result = await commands.executeCreateCharacter(dto, userId);
    return successWithDataResponse(c, result);
  })
  .openapi(characterRouteConfigs.updateCharacter, async (c) => {
    const characterId = c.req.valid("param").characterId;
    const dto = c.req.valid("json");
    const userId = c.get("user")?.id;
    if (!userId) {
      return errorResponse(c, 401, "unauthorized", "warn", "user", {
        userId: "required",
      });
    }

    const result = await commands.executeUpdateCharacter(
      characterId,
      dto,
      userId,
    );
    return successWithDataResponse(c, result);
  })
  .openapi(characterRouteConfigs.deleteCharacter, async (c) => {
    const characterId = c.req.valid("param").characterId;
    const userId = c.get("user")?.id;
    if (!userId) {
      return errorResponse(c, 401, "unauthorized", "warn", "user", {
        userId: "required",
      });
    }

    await commands.executeDeleteCharacter(characterId, userId);
    return successWithoutDataResponse(c);
  })
  .openapi(characterRouteConfigs.linkAssetToCharacter, async (c) => {
    const characterId = c.req.valid("param").characterId;
    const dto = c.req.valid("json");
    const userId = c.get("user")?.id;
    if (!userId) {
      return errorResponse(c, 401, "unauthorized", "warn", "user", {
        userId: "required",
      });
    }

    await commands.executeLinkAssetToCharacter(characterId, dto, userId);
    return successWithoutDataResponse(c);
  })
  .openapi(characterRouteConfigs.unlinkAssetFromCharacter, async (c) => {
    const { characterId, assetId } = c.req.valid("param");
    const userId = c.get("user")?.id;
    if (!userId) {
      return errorResponse(c, 401, "unauthorized", "warn", "user", {
        userId: "required",
      });
    }

    await commands.executeUnlinkAssetFromCharacter(
      characterId,
      assetId,
      userId,
    );
    return successWithoutDataResponse(c);
  })
  .openapi(characterRouteConfigs.unlinkCharacterFromGame, async (c) => {
    const { characterId, gameId } = c.req.valid("param");
    const userId = c.get("user")?.id;
    if (!userId) {
      return errorResponse(c, 401, "unauthorized", "warn", "user", {
        userId: "required",
      });
    }
    await commands.executeUnlinkCharacterFromGame(characterId, gameId, userId);
    return successWithoutDataResponse(c);
  });

characterRoutes.onError(errorHandler);

export { assetRoutes, characterRoutes };
