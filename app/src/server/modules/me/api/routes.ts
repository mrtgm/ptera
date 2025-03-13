import { isAuthenticated } from "@/server/core/middleware/auth";
import { createRouteConfig } from "@/server/lib/doc";
import {
	errorResponses,
	successWithDataSchema,
} from "@/server/shared/schema/response";
import { gameResourcesSchema } from "../../assets/domain/resoucres";
import { gameResponseDtoSchema } from "../../games/application/dto";

export const dashboardRouteConfigs = {
	getMyGames: createRouteConfig({
		method: "get",
		path: "/games",
		guard: [isAuthenticated],
		tags: ["dashboard"],
		summary: "自分のゲーム一覧を取得します。",
		responses: {
			200: {
				description: "My Games",
				content: {
					"application/json": {
						schema: successWithDataSchema(gameResponseDtoSchema.array()),
					},
				},
			},
			...errorResponses,
		},
	}),

	getMyResources: createRouteConfig({
		method: "get",
		path: "/assets",
		guard: [isAuthenticated],
		tags: ["dashboard"],
		summary: "自分のアセット一覧を取得します。",
		responses: {
			200: {
				description: "My Assets",
				content: {
					"application/json": {
						schema: successWithDataSchema(gameResourcesSchema),
					},
				},
			},
			...errorResponses,
		},
	}),
};
