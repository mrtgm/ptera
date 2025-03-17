/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AssetsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * アセットをアップロードします。
     * @param formData
     * @returns any Uploaded Asset
     * @throws ApiError
     */
    public postApiV1Assets(
        formData?: {
            name: string;
            assetType: ('bgm' | 'soundEffect' | 'backgroundImage' | 'cgImage' | 'characterImage');
            metadata?: any;
            file: any;
        },
    ): CancelablePromise<{
        success: boolean;
        data: {
            id: number;
            assetType: ('bgm' | 'soundEffect' | 'backgroundImage' | 'cgImage' | 'characterImage');
            name: string;
            url: string;
            ownerId: number | null;
            isPublic: boolean;
            metadata?: any;
        };
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/assets',
            formData: formData,
            mediaType: 'multipart/form-data',
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
     * アセットを更新します。
     * @param assetId
     * @param requestBody
     * @returns any Updated Asset
     * @throws ApiError
     */
    public putApiV1Assets(
        assetId: (number | string),
        requestBody?: {
            name: string;
            metadata?: any;
        },
    ): CancelablePromise<{
        success: boolean;
        data: {
            id: number;
            assetType: ('bgm' | 'soundEffect' | 'backgroundImage' | 'cgImage' | 'characterImage');
            name: string;
            url: string;
            ownerId: number | null;
            isPublic: boolean;
            metadata?: any;
        };
    }> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/assets/{assetId}',
            path: {
                'assetId': assetId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
     * アセットを削除します。
     * @param assetId
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiV1Assets(
        assetId: (number | string),
    ): CancelablePromise<{
        success: boolean;
    }> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/assets/{assetId}',
            path: {
                'assetId': assetId,
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
     * アセットからゲームの関連付けを解除します。
     * @param gameId
     * @param assetId
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiV1AssetsGames(
        gameId: (number | string),
        assetId: (number | string),
    ): CancelablePromise<{
        success: boolean;
    }> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/assets/{assetId}/games/{gameId}',
            path: {
                'gameId': gameId,
                'assetId': assetId,
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
}
