import { isPublicAccess } from "~/core/middleware/auth";
import { createRouteConfig } from "~/lib/doc";
import {
	errorResponses,
	successWithPaginationSchema,
} from "~/shared/schema/response";
import { gameResponseDtoSchema } from "../application/dto";
import { getGamesRequstSchema } from "./validator";

export const gameRouteCongfigs = {
	getGames: createRouteConfig({
		method: "get",
		path: "/",
		guard: [isPublicAccess],
		tags: ["games"],
		summary: "ゲーム一覧を取得します。",
		request: {
			query: getGamesRequstSchema,
		},
		responses: {
			200: {
				description: "Users",
				content: {
					"application/json": {
						schema: successWithPaginationSchema(gameResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),
};
