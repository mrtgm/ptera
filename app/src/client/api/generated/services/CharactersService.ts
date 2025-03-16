/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CharactersService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * キャラクターを作成します。
     * @param requestBody
     * @returns any Created Character
     * @throws ApiError
     */
    public postApiV1Characters(
        requestBody?: {
            name: string;
        },
    ): CancelablePromise<{
        success: boolean;
        data: {
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
        };
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/characters',
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
     * キャラクターを更新します。
     * @param characterId
     * @param requestBody
     * @returns any Updated Character
     * @throws ApiError
     */
    public putApiV1Characters(
        characterId: (number | string),
        requestBody?: {
            name: string;
        },
    ): CancelablePromise<{
        success: boolean;
        data: {
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
        };
    }> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/characters/{characterId}',
            path: {
                'characterId': characterId,
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
     * キャラクターを削除します。
     * @param characterId
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiV1Characters(
        characterId: (number | string),
    ): CancelablePromise<{
        success: boolean;
    }> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/characters/{characterId}',
            path: {
                'characterId': characterId,
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
     * キャラクターにアセットを関連付けます。
     * @param characterId
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public postApiV1CharactersAssets(
        characterId: (number | string),
        requestBody?: {
            assetId: number;
        },
    ): CancelablePromise<{
        success: boolean;
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/characters/{characterId}/assets',
            path: {
                'characterId': characterId,
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
     * キャラクターからアセットの関連付けを解除します。
     * @param characterId
     * @param assetId
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiV1CharactersAssets(
        characterId: (number | string),
        assetId: (number | string),
    ): CancelablePromise<{
        success: boolean;
    }> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/characters/{characterId}/assets/{assetId}',
            path: {
                'characterId': characterId,
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
