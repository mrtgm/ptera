/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DashboardService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 自分がいいねしたゲーム一覧を取得します。
     * @returns any My Liked Games
     * @throws ApiError
     */
    public getApiV1MeLiked(): CancelablePromise<{
        success: boolean;
        data: Array<number>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/me/liked',
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
     * 自分のゲーム一覧を取得します。
     * @returns any My Games
     * @throws ApiError
     */
    public getApiV1MeGames(): CancelablePromise<{
        success: boolean;
        data: Array<{
            id: number;
            userId: number;
            name: string;
            description: string | null;
            releaseDate: string | null;
            coverImageUrl: string | null;
            schemaVersion: string;
            status: ('draft' | 'published' | 'archived');
            categoryIds: Array<number>;
            likeCount: number;
            playCount: number;
            createdAt: string;
            updatedAt: string;
        }>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/me/games',
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
     * 自分のアセット一覧を取得します。
     * @returns any My Assets
     * @throws ApiError
     */
    public getApiV1MeAssets(): CancelablePromise<{
        success: boolean;
        data: {
            character: Record<string, {
                id: number;
                ownerId: number | null;
                isPublic: boolean;
                name: string;
                images?: Record<string, {
                    id: number;
                    assetType: 'characterImage';
                    name: string;
                    url: string;
                    ownerId: number | null;
                    isPublic: boolean;
                    metadata?: any;
                }>;
            }>;
            backgroundImage: Record<string, {
                id: number;
                assetType: 'backgroundImage';
                name: string;
                url: string;
                ownerId: number | null;
                isPublic: boolean;
                metadata?: any;
            }>;
            soundEffect: Record<string, {
                id: number;
                assetType: 'soundEffect';
                name: string;
                url: string;
                ownerId: number | null;
                isPublic: boolean;
                metadata?: any;
            }>;
            bgm: Record<string, {
                id: number;
                assetType: 'bgm';
                name: string;
                url: string;
                ownerId: number | null;
                isPublic: boolean;
                metadata?: any;
            }>;
            cgImage: Record<string, {
                id: number;
                assetType: 'cgImage';
                name: string;
                url: string;
                ownerId: number | null;
                isPublic: boolean;
                metadata?: any;
            }>;
        };
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/me/assets',
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
