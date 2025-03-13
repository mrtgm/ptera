import { isAuthenticated } from "@/server/core/middleware/auth";
import { createRouteConfig } from "@/server/lib/doc";

import {
	errorResponses,
	successWithDataSchema,
	successWithoutDataSchema,
} from "@/server/shared/schema/response";

import {
	assetCharacterLinkSchema,
	assetResponseSchema,
	characterResponseSchema,
	createAssetSchema,
	createCharacterSchema,
	updateAssetSchema,
	updateCharacterSchema,
} from "../application/dto";
import {
	assetCharacterLinkParamSchema,
	assetParamSchema,
	characterParamSchema,
} from "./validator";

// アセット関連のルート設定
export const assetRouteConfigs = {
	// アセットアップロード
	uploadAsset: createRouteConfig({
		method: "post",
		path: "/",
		guard: [isAuthenticated],
		tags: ["assets"],
		summary: "アセットをアップロードします。",
		request: {
			body: {
				content: {
					"multipart/form-data": {
						schema: createAssetSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Uploaded Asset",
				content: {
					"application/json": {
						schema: successWithDataSchema(assetResponseSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	// アセット更新
	updateAsset: createRouteConfig({
		method: "put",
		path: "/{assetId}",
		guard: [isAuthenticated],
		tags: ["assets"],
		summary: "アセットを更新します。",
		request: {
			params: assetParamSchema,
			body: {
				content: {
					"application/json": {
						schema: updateAssetSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Updated Asset",
				content: {
					"application/json": {
						schema: successWithDataSchema(assetResponseSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	deleteAsset: createRouteConfig({
		method: "delete",
		path: "/{assetId}",
		guard: [isAuthenticated],
		tags: ["assets"],
		summary: "アセットを削除します。",
		request: {
			params: assetParamSchema,
		},
		responses: {
			200: {
				description: "Success",
				content: {
					"application/json": {
						schema: successWithoutDataSchema,
					},
				},
			},
			...errorResponses,
		},
	}),
};

// キャラクター関連のルート設定
export const characterRouteConfigs = {
	// キャラクター作成
	createCharacter: createRouteConfig({
		method: "post",
		path: "/",
		guard: [isAuthenticated],
		tags: ["characters"],
		summary: "キャラクターを作成します。",
		request: {
			body: {
				content: {
					"application/json": {
						schema: createCharacterSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Created Character",
				content: {
					"application/json": {
						schema: successWithDataSchema(characterResponseSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	// キャラクター更新
	updateCharacter: createRouteConfig({
		method: "put",
		path: "/{characterId}",
		guard: [isAuthenticated],
		tags: ["characters"],
		summary: "キャラクターを更新します。",
		request: {
			params: characterParamSchema,
			body: {
				content: {
					"application/json": {
						schema: updateCharacterSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Updated Character",
				content: {
					"application/json": {
						schema: successWithDataSchema(characterResponseSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	// キャラクター削除
	deleteCharacter: createRouteConfig({
		method: "delete",
		path: "/{characterId}",
		guard: [isAuthenticated],
		tags: ["characters"],
		summary: "キャラクターを削除します。",
		request: {
			params: characterParamSchema,
		},
		responses: {
			200: {
				description: "Success",
				content: {
					"application/json": {
						schema: successWithoutDataSchema,
					},
				},
			},
			...errorResponses,
		},
	}),

	// キャラクターにアセットを関連付け
	linkAssetToCharacter: createRouteConfig({
		method: "post",
		path: "/{characterId}/assets",
		guard: [isAuthenticated],
		tags: ["characters"],
		summary: "キャラクターにアセットを関連付けます。",
		request: {
			params: characterParamSchema,
			body: {
				content: {
					"application/json": {
						schema: assetCharacterLinkSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Success",
				content: {
					"application/json": {
						schema: successWithoutDataSchema,
					},
				},
			},
			...errorResponses,
		},
	}),

	// キャラクターからアセットの関連付けを解除
	unlinkAssetFromCharacter: createRouteConfig({
		method: "delete",
		path: "/{characterId}/assets/{assetId}",
		guard: [isAuthenticated],
		tags: ["characters"],
		summary: "キャラクターからアセットの関連付けを解除します。",
		request: {
			params: assetCharacterLinkParamSchema,
		},
		responses: {
			200: {
				description: "Success",
				content: {
					"application/json": {
						schema: successWithoutDataSchema,
					},
				},
			},
			...errorResponses,
		},
	}),
};
