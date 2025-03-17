/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";
export class UsersService {
	constructor(public readonly httpRequest: BaseHttpRequest) {}
	/**
	 * ユーザー情報を取得します。
	 * @param userId
	 * @returns any User
	 * @throws ApiError
	 */
	public getApiV1Users(userId: number | string): CancelablePromise<{
		success: boolean;
		data: {
			id: number;
			jwtSub: string;
			name: string;
			bio?: string | null;
			avatarUrl?: string | null;
		};
	}> {
		return this.httpRequest.request({
			method: "GET",
			url: "/api/v1/users/{userId}",
			path: {
				userId: userId,
			},
			errors: {
				400: `Bad request: problem processing request.`,
				401: `Unauthorized: authentication required.`,
				403: `Forbidden: insufficient permissions.`,
				404: `Not found: resource does not exist.`,
				429: `Rate limit: too many requests.`,
				500: `Internal server error: unexpected error.`,
			},
		});
	}
	/**
	 * ユーザーが作成したゲーム一覧を取得します。
	 * @param userId
	 * @returns any User Games
	 * @throws ApiError
	 */
	public getApiV1UsersGames(userId: number | string): CancelablePromise<{
		success: boolean;
		data: Array<{
			id: number;
			userId: number;
			name: string;
			description: string | null;
			releaseDate: string | null;
			coverImageUrl: string | null;
			schemaVersion: string;
			status: "draft" | "published" | "archived";
			categoryIds: Array<number>;
			likeCount: number;
			playCount: number;
			createdAt: string;
			updatedAt: string;
			username: string;
			avatarUrl?: string | null;
		}>;
	}> {
		return this.httpRequest.request({
			method: "GET",
			url: "/api/v1/users/{userId}/games",
			path: {
				userId: userId,
			},
			errors: {
				400: `Bad request: problem processing request.`,
				401: `Unauthorized: authentication required.`,
				403: `Forbidden: insufficient permissions.`,
				404: `Not found: resource does not exist.`,
				429: `Rate limit: too many requests.`,
				500: `Internal server error: unexpected error.`,
			},
		});
	}
	/**
	 * ユーザーのプロフィール情報を更新します。
	 * @param userId
	 * @param requestBody
	 * @returns any Updated User Profile
	 * @throws ApiError
	 */
	public putApiV1UsersProfile(
		userId: number | string,
		requestBody?: {
			name: string;
			bio?: string | null;
			avatarUrl?: string | null;
		},
	): CancelablePromise<{
		success: boolean;
		data: {
			id: number;
			jwtSub: string;
			name: string;
			bio?: string | null;
			avatarUrl?: string | null;
		};
	}> {
		return this.httpRequest.request({
			method: "PUT",
			url: "/api/v1/users/{userId}/profile",
			path: {
				userId: userId,
			},
			body: requestBody,
			mediaType: "application/json",
			errors: {
				400: `Bad request: problem processing request.`,
				401: `Unauthorized: authentication required.`,
				403: `Forbidden: insufficient permissions.`,
				404: `Not found: resource does not exist.`,
				429: `Rate limit: too many requests.`,
				500: `Internal server error: unexpected error.`,
			},
		});
	}
}
