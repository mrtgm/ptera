/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class GamesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * ゲームカテゴリ一覧を取得します。
     * @returns any Categories
     * @throws ApiError
     */
    public getApiV1GamesCategories(): CancelablePromise<{
        success: boolean;
        data: Array<{
            id: number;
            name: string;
            createdAt: string;
            updatedAt: string;
        }>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/games/categories',
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
     * ゲームを取得します。
     * @param gameId
     * @returns any Game
     * @throws ApiError
     */
    public getApiV1Games(
        gameId: (number | string),
    ): CancelablePromise<{
        success: boolean;
        data: {
            scenes: Array<({
                id: number;
                name: string;
                sceneType: 'goto';
                events: Array<({
                    id: number;
                    eventType: 'textRender';
                    category: 'message';
                    orderIndex: string;
                    text: string;
                    characterName?: string | null;
                } | {
                    id: number;
                    eventType: 'appearMessageWindow';
                    category: 'message';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideMessageWindow';
                    category: 'message';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'appearCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    characterImageId: number;
                    position: any[];
                    scale: (number | string);
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideAllCharacters';
                    category: 'character';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'moveCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    position: any[];
                    scale: (number | string);
                } | {
                    id: number;
                    eventType: 'bgmStart';
                    category: 'media';
                    orderIndex: string;
                    bgmId: number;
                    loop: boolean;
                    volume: (number | string);
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'bgmStop';
                    category: 'media';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'soundEffect';
                    category: 'media';
                    orderIndex: string;
                    volume: (number | string);
                    loop: boolean;
                    soundEffectId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'changeBackground';
                    category: 'background';
                    orderIndex: string;
                    backgroundId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'effect';
                    category: 'effect';
                    orderIndex: string;
                    effectType: 'fadeIn' | 'fadeOut' | 'shake';
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'characterEffect';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'appearCG';
                    category: 'cg';
                    orderIndex: string;
                    cgImageId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideCG';
                    category: 'cg';
                    orderIndex: string;
                    transitionDuration: (number | string);
                })>;
                nextSceneId: number;
            } | {
                id: number;
                name: string;
                sceneType: 'choice';
                events: Array<({
                    id: number;
                    eventType: 'textRender';
                    category: 'message';
                    orderIndex: string;
                    text: string;
                    characterName?: string | null;
                } | {
                    id: number;
                    eventType: 'appearMessageWindow';
                    category: 'message';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideMessageWindow';
                    category: 'message';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'appearCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    characterImageId: number;
                    position: any[];
                    scale: (number | string);
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideAllCharacters';
                    category: 'character';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'moveCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    position: any[];
                    scale: (number | string);
                } | {
                    id: number;
                    eventType: 'bgmStart';
                    category: 'media';
                    orderIndex: string;
                    bgmId: number;
                    loop: boolean;
                    volume: (number | string);
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'bgmStop';
                    category: 'media';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'soundEffect';
                    category: 'media';
                    orderIndex: string;
                    volume: (number | string);
                    loop: boolean;
                    soundEffectId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'changeBackground';
                    category: 'background';
                    orderIndex: string;
                    backgroundId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'effect';
                    category: 'effect';
                    orderIndex: string;
                    effectType: 'fadeIn' | 'fadeOut' | 'shake';
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'characterEffect';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'appearCG';
                    category: 'cg';
                    orderIndex: string;
                    cgImageId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideCG';
                    category: 'cg';
                    orderIndex: string;
                    transitionDuration: (number | string);
                })>;
                choices: Array<{
                    id: number;
                    text: string;
                    nextSceneId: number;
                }>;
            } | {
                id: number;
                name: string;
                sceneType: 'end';
                events: Array<({
                    id: number;
                    eventType: 'textRender';
                    category: 'message';
                    orderIndex: string;
                    text: string;
                    characterName?: string | null;
                } | {
                    id: number;
                    eventType: 'appearMessageWindow';
                    category: 'message';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideMessageWindow';
                    category: 'message';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'appearCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    characterImageId: number;
                    position: any[];
                    scale: (number | string);
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideAllCharacters';
                    category: 'character';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'moveCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    position: any[];
                    scale: (number | string);
                } | {
                    id: number;
                    eventType: 'bgmStart';
                    category: 'media';
                    orderIndex: string;
                    bgmId: number;
                    loop: boolean;
                    volume: (number | string);
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'bgmStop';
                    category: 'media';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'soundEffect';
                    category: 'media';
                    orderIndex: string;
                    volume: (number | string);
                    loop: boolean;
                    soundEffectId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'changeBackground';
                    category: 'background';
                    orderIndex: string;
                    backgroundId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'effect';
                    category: 'effect';
                    orderIndex: string;
                    effectType: 'fadeIn' | 'fadeOut' | 'shake';
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'characterEffect';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'appearCG';
                    category: 'cg';
                    orderIndex: string;
                    cgImageId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideCG';
                    category: 'cg';
                    orderIndex: string;
                    transitionDuration: (number | string);
                })>;
            })>;
            initialSceneId: number;
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
            username: string;
            avatarUrl?: string | null;
        };
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/games/{gameId}',
            path: {
                'gameId': gameId,
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
     * ゲームを更新します。
     * @param gameId
     * @param requestBody
     * @returns any Updated Game
     * @throws ApiError
     */
    public putApiV1Games(
        gameId: (number | string),
        requestBody?: {
            name?: string | null;
            description?: string | null;
            coverImageUrl?: string | null;
            categoryIds?: any[] | null;
        },
    ): CancelablePromise<{
        success: boolean;
        data: {
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
        };
    }> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/games/{gameId}',
            path: {
                'gameId': gameId,
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
     * ゲームを削除します。
     * @param gameId
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiV1Games(
        gameId: (number | string),
        requestBody?: any,
    ): CancelablePromise<{
        success: boolean;
    }> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/games/{gameId}',
            path: {
                'gameId': gameId,
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
     * ゲームのアセットを取得します。
     * @param gameId
     * @returns any Game
     * @throws ApiError
     */
    public getApiV1GamesAssets(
        gameId: (number | string),
    ): CancelablePromise<{
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
            url: '/api/v1/games/{gameId}/assets',
            path: {
                'gameId': gameId,
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
     * ゲーム一覧を取得します。
     * @param q
     * @param sort
     * @param order
     * @param offset
     * @param limit
     * @param categoryId
     * @returns any Games
     * @throws ApiError
     */
    public getApiV1Games1(
        q?: string,
        sort: 'createdAt' | 'likeCount' | 'playCount' = 'createdAt',
        order: 'asc' | 'desc' = 'asc',
        offset?: (number | string),
        limit?: (number | string),
        categoryId?: (number | string),
    ): CancelablePromise<{
        success: boolean;
        data: {
            items: Array<{
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
                username: string;
                avatarUrl?: string | null;
            }>;
            total: number;
        };
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/games',
            query: {
                'q': q,
                'sort': sort,
                'order': order,
                'offset': offset,
                'limit': limit,
                'categoryId': categoryId,
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
     * ゲームを作成します。
     * @param requestBody
     * @returns any Game
     * @throws ApiError
     */
    public postApiV1Games(
        requestBody?: {
            name: string;
            description: string | null;
        },
    ): CancelablePromise<{
        success: boolean;
        data: {
            scenes: Array<({
                id: number;
                name: string;
                sceneType: 'goto';
                events: Array<({
                    id: number;
                    eventType: 'textRender';
                    category: 'message';
                    orderIndex: string;
                    text: string;
                    characterName?: string | null;
                } | {
                    id: number;
                    eventType: 'appearMessageWindow';
                    category: 'message';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideMessageWindow';
                    category: 'message';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'appearCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    characterImageId: number;
                    position: any[];
                    scale: (number | string);
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideAllCharacters';
                    category: 'character';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'moveCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    position: any[];
                    scale: (number | string);
                } | {
                    id: number;
                    eventType: 'bgmStart';
                    category: 'media';
                    orderIndex: string;
                    bgmId: number;
                    loop: boolean;
                    volume: (number | string);
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'bgmStop';
                    category: 'media';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'soundEffect';
                    category: 'media';
                    orderIndex: string;
                    volume: (number | string);
                    loop: boolean;
                    soundEffectId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'changeBackground';
                    category: 'background';
                    orderIndex: string;
                    backgroundId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'effect';
                    category: 'effect';
                    orderIndex: string;
                    effectType: 'fadeIn' | 'fadeOut' | 'shake';
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'characterEffect';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'appearCG';
                    category: 'cg';
                    orderIndex: string;
                    cgImageId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideCG';
                    category: 'cg';
                    orderIndex: string;
                    transitionDuration: (number | string);
                })>;
                nextSceneId: number;
            } | {
                id: number;
                name: string;
                sceneType: 'choice';
                events: Array<({
                    id: number;
                    eventType: 'textRender';
                    category: 'message';
                    orderIndex: string;
                    text: string;
                    characterName?: string | null;
                } | {
                    id: number;
                    eventType: 'appearMessageWindow';
                    category: 'message';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideMessageWindow';
                    category: 'message';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'appearCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    characterImageId: number;
                    position: any[];
                    scale: (number | string);
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideAllCharacters';
                    category: 'character';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'moveCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    position: any[];
                    scale: (number | string);
                } | {
                    id: number;
                    eventType: 'bgmStart';
                    category: 'media';
                    orderIndex: string;
                    bgmId: number;
                    loop: boolean;
                    volume: (number | string);
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'bgmStop';
                    category: 'media';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'soundEffect';
                    category: 'media';
                    orderIndex: string;
                    volume: (number | string);
                    loop: boolean;
                    soundEffectId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'changeBackground';
                    category: 'background';
                    orderIndex: string;
                    backgroundId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'effect';
                    category: 'effect';
                    orderIndex: string;
                    effectType: 'fadeIn' | 'fadeOut' | 'shake';
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'characterEffect';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'appearCG';
                    category: 'cg';
                    orderIndex: string;
                    cgImageId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideCG';
                    category: 'cg';
                    orderIndex: string;
                    transitionDuration: (number | string);
                })>;
                choices: Array<{
                    id: number;
                    text: string;
                    nextSceneId: number;
                }>;
            } | {
                id: number;
                name: string;
                sceneType: 'end';
                events: Array<({
                    id: number;
                    eventType: 'textRender';
                    category: 'message';
                    orderIndex: string;
                    text: string;
                    characterName?: string | null;
                } | {
                    id: number;
                    eventType: 'appearMessageWindow';
                    category: 'message';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideMessageWindow';
                    category: 'message';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'appearCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    characterImageId: number;
                    position: any[];
                    scale: (number | string);
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideAllCharacters';
                    category: 'character';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'moveCharacter';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    position: any[];
                    scale: (number | string);
                } | {
                    id: number;
                    eventType: 'bgmStart';
                    category: 'media';
                    orderIndex: string;
                    bgmId: number;
                    loop: boolean;
                    volume: (number | string);
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'bgmStop';
                    category: 'media';
                    orderIndex: string;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'soundEffect';
                    category: 'media';
                    orderIndex: string;
                    volume: (number | string);
                    loop: boolean;
                    soundEffectId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'changeBackground';
                    category: 'background';
                    orderIndex: string;
                    backgroundId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'effect';
                    category: 'effect';
                    orderIndex: string;
                    effectType: 'fadeIn' | 'fadeOut' | 'shake';
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'characterEffect';
                    category: 'character';
                    orderIndex: string;
                    characterId: number;
                    effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'appearCG';
                    category: 'cg';
                    orderIndex: string;
                    cgImageId: number;
                    transitionDuration: (number | string);
                } | {
                    id: number;
                    eventType: 'hideCG';
                    category: 'cg';
                    orderIndex: string;
                    transitionDuration: (number | string);
                })>;
            })>;
            initialSceneId: number;
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
            username: string;
            avatarUrl?: string | null;
        };
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/games',
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
     * ゲームのステータスを更新します。
     * @param gameId
     * @param requestBody
     * @returns any Updated Game
     * @throws ApiError
     */
    public putApiV1GamesStatus(
        gameId: (number | string),
        requestBody?: {
            status: 'draft' | 'published' | 'archived';
        },
    ): CancelablePromise<{
        success: boolean;
        data: {
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
        };
    }> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/games/{gameId}/status',
            path: {
                'gameId': gameId,
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
     * ゲームのプレイ回数を増やします。
     * @param gameId
     * @returns any Success
     * @throws ApiError
     */
    public postApiV1GamesPlay(
        gameId: (number | string),
    ): CancelablePromise<{
        success: boolean;
        data: {
            count: number;
        };
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/games/{gameId}/play',
            path: {
                'gameId': gameId,
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
     * ゲームにいいねを追加します。
     * @param gameId
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public postApiV1GamesLikes(
        gameId: (number | string),
        requestBody?: any,
    ): CancelablePromise<{
        success: boolean;
        data: {
            count: number;
        };
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/games/{gameId}/likes',
            path: {
                'gameId': gameId,
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
     * ゲームのいいねを取り消します。
     * @param gameId
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiV1GamesLikes(
        gameId: (number | string),
        requestBody?: any,
    ): CancelablePromise<{
        success: boolean;
        data: {
            count: number;
        };
    }> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/games/{gameId}/likes',
            path: {
                'gameId': gameId,
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
     * ゲームのコメント一覧を取得します。
     * @param gameId
     * @returns any Comments
     * @throws ApiError
     */
    public getApiV1GamesComments(
        gameId: (number | string),
    ): CancelablePromise<{
        success: boolean;
        data: Array<{
            id: number;
            userId: number;
            username: string;
            avatarUrl?: string | null;
            gameId: number;
            content: string;
            createdAt: string;
            updatedAt: string;
        }>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/games/{gameId}/comments',
            path: {
                'gameId': gameId,
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
     * ゲームにコメントを投稿します。
     * @param gameId
     * @param requestBody
     * @returns any Created Comment
     * @throws ApiError
     */
    public postApiV1GamesComments(
        gameId: (number | string),
        requestBody?: {
            content: string;
        },
    ): CancelablePromise<{
        success: boolean;
        data: {
            id: number;
            userId: number;
            username: string;
            avatarUrl?: string | null;
            gameId: number;
            content: string;
            createdAt: string;
            updatedAt: string;
        };
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/games/{gameId}/comments',
            path: {
                'gameId': gameId,
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
     * コメントを削除します。
     * @param gameId
     * @param commentId
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiV1GamesComments(
        gameId: (number | string),
        commentId: (number | string),
        requestBody?: any,
    ): CancelablePromise<{
        success: boolean;
    }> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/games/{gameId}/comments/{commentId}',
            path: {
                'gameId': gameId,
                'commentId': commentId,
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
     * シーンを取得します。
     * @param gameId
     * @param sceneId
     * @returns any Scene
     * @throws ApiError
     */
    public getApiV1GamesScenes(
        gameId: (number | string),
        sceneId: (number | string),
    ): CancelablePromise<{
        success: boolean;
        data: ({
            id: number;
            name: string;
            sceneType: 'goto';
            events: Array<({
                id: number;
                eventType: 'textRender';
                category: 'message';
                orderIndex: string;
                text: string;
                characterName?: string | null;
            } | {
                id: number;
                eventType: 'appearMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                characterImageId: number;
                position: any[];
                scale: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideAllCharacters';
                category: 'character';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'moveCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                position: any[];
                scale: (number | string);
            } | {
                id: number;
                eventType: 'bgmStart';
                category: 'media';
                orderIndex: string;
                bgmId: number;
                loop: boolean;
                volume: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'bgmStop';
                category: 'media';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'soundEffect';
                category: 'media';
                orderIndex: string;
                volume: (number | string);
                loop: boolean;
                soundEffectId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'changeBackground';
                category: 'background';
                orderIndex: string;
                backgroundId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'effect';
                category: 'effect';
                orderIndex: string;
                effectType: 'fadeIn' | 'fadeOut' | 'shake';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'characterEffect';
                category: 'character';
                orderIndex: string;
                characterId: number;
                effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCG';
                category: 'cg';
                orderIndex: string;
                cgImageId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCG';
                category: 'cg';
                orderIndex: string;
                transitionDuration: (number | string);
            })>;
            nextSceneId: number;
        } | {
            id: number;
            name: string;
            sceneType: 'choice';
            events: Array<({
                id: number;
                eventType: 'textRender';
                category: 'message';
                orderIndex: string;
                text: string;
                characterName?: string | null;
            } | {
                id: number;
                eventType: 'appearMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                characterImageId: number;
                position: any[];
                scale: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideAllCharacters';
                category: 'character';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'moveCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                position: any[];
                scale: (number | string);
            } | {
                id: number;
                eventType: 'bgmStart';
                category: 'media';
                orderIndex: string;
                bgmId: number;
                loop: boolean;
                volume: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'bgmStop';
                category: 'media';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'soundEffect';
                category: 'media';
                orderIndex: string;
                volume: (number | string);
                loop: boolean;
                soundEffectId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'changeBackground';
                category: 'background';
                orderIndex: string;
                backgroundId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'effect';
                category: 'effect';
                orderIndex: string;
                effectType: 'fadeIn' | 'fadeOut' | 'shake';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'characterEffect';
                category: 'character';
                orderIndex: string;
                characterId: number;
                effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCG';
                category: 'cg';
                orderIndex: string;
                cgImageId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCG';
                category: 'cg';
                orderIndex: string;
                transitionDuration: (number | string);
            })>;
            choices: Array<{
                id: number;
                text: string;
                nextSceneId: number;
            }>;
        } | {
            id: number;
            name: string;
            sceneType: 'end';
            events: Array<({
                id: number;
                eventType: 'textRender';
                category: 'message';
                orderIndex: string;
                text: string;
                characterName?: string | null;
            } | {
                id: number;
                eventType: 'appearMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                characterImageId: number;
                position: any[];
                scale: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideAllCharacters';
                category: 'character';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'moveCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                position: any[];
                scale: (number | string);
            } | {
                id: number;
                eventType: 'bgmStart';
                category: 'media';
                orderIndex: string;
                bgmId: number;
                loop: boolean;
                volume: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'bgmStop';
                category: 'media';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'soundEffect';
                category: 'media';
                orderIndex: string;
                volume: (number | string);
                loop: boolean;
                soundEffectId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'changeBackground';
                category: 'background';
                orderIndex: string;
                backgroundId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'effect';
                category: 'effect';
                orderIndex: string;
                effectType: 'fadeIn' | 'fadeOut' | 'shake';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'characterEffect';
                category: 'character';
                orderIndex: string;
                characterId: number;
                effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCG';
                category: 'cg';
                orderIndex: string;
                cgImageId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCG';
                category: 'cg';
                orderIndex: string;
                transitionDuration: (number | string);
            })>;
        });
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/games/{gameId}/scenes/{sceneId}',
            path: {
                'gameId': gameId,
                'sceneId': sceneId,
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
     * シーンを更新します。
     * @param gameId
     * @param sceneId
     * @param requestBody
     * @returns any Updated Scene
     * @throws ApiError
     */
    public putApiV1GamesScenes(
        gameId: (number | string),
        sceneId: (number | string),
        requestBody?: {
            sceneType: 'choice' | 'goto' | 'end';
            choices?: Array<{
                text: string;
                nextSceneId: number;
            }>;
            nextSceneId?: number;
        },
    ): CancelablePromise<{
        success: boolean;
        data: ({
            id: number;
            name: string;
            sceneType: 'goto';
            events: Array<({
                id: number;
                eventType: 'textRender';
                category: 'message';
                orderIndex: string;
                text: string;
                characterName?: string | null;
            } | {
                id: number;
                eventType: 'appearMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                characterImageId: number;
                position: any[];
                scale: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideAllCharacters';
                category: 'character';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'moveCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                position: any[];
                scale: (number | string);
            } | {
                id: number;
                eventType: 'bgmStart';
                category: 'media';
                orderIndex: string;
                bgmId: number;
                loop: boolean;
                volume: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'bgmStop';
                category: 'media';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'soundEffect';
                category: 'media';
                orderIndex: string;
                volume: (number | string);
                loop: boolean;
                soundEffectId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'changeBackground';
                category: 'background';
                orderIndex: string;
                backgroundId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'effect';
                category: 'effect';
                orderIndex: string;
                effectType: 'fadeIn' | 'fadeOut' | 'shake';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'characterEffect';
                category: 'character';
                orderIndex: string;
                characterId: number;
                effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCG';
                category: 'cg';
                orderIndex: string;
                cgImageId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCG';
                category: 'cg';
                orderIndex: string;
                transitionDuration: (number | string);
            })>;
            nextSceneId: number;
        } | {
            id: number;
            name: string;
            sceneType: 'choice';
            events: Array<({
                id: number;
                eventType: 'textRender';
                category: 'message';
                orderIndex: string;
                text: string;
                characterName?: string | null;
            } | {
                id: number;
                eventType: 'appearMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                characterImageId: number;
                position: any[];
                scale: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideAllCharacters';
                category: 'character';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'moveCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                position: any[];
                scale: (number | string);
            } | {
                id: number;
                eventType: 'bgmStart';
                category: 'media';
                orderIndex: string;
                bgmId: number;
                loop: boolean;
                volume: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'bgmStop';
                category: 'media';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'soundEffect';
                category: 'media';
                orderIndex: string;
                volume: (number | string);
                loop: boolean;
                soundEffectId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'changeBackground';
                category: 'background';
                orderIndex: string;
                backgroundId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'effect';
                category: 'effect';
                orderIndex: string;
                effectType: 'fadeIn' | 'fadeOut' | 'shake';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'characterEffect';
                category: 'character';
                orderIndex: string;
                characterId: number;
                effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCG';
                category: 'cg';
                orderIndex: string;
                cgImageId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCG';
                category: 'cg';
                orderIndex: string;
                transitionDuration: (number | string);
            })>;
            choices: Array<{
                id: number;
                text: string;
                nextSceneId: number;
            }>;
        } | {
            id: number;
            name: string;
            sceneType: 'end';
            events: Array<({
                id: number;
                eventType: 'textRender';
                category: 'message';
                orderIndex: string;
                text: string;
                characterName?: string | null;
            } | {
                id: number;
                eventType: 'appearMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                characterImageId: number;
                position: any[];
                scale: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideAllCharacters';
                category: 'character';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'moveCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                position: any[];
                scale: (number | string);
            } | {
                id: number;
                eventType: 'bgmStart';
                category: 'media';
                orderIndex: string;
                bgmId: number;
                loop: boolean;
                volume: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'bgmStop';
                category: 'media';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'soundEffect';
                category: 'media';
                orderIndex: string;
                volume: (number | string);
                loop: boolean;
                soundEffectId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'changeBackground';
                category: 'background';
                orderIndex: string;
                backgroundId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'effect';
                category: 'effect';
                orderIndex: string;
                effectType: 'fadeIn' | 'fadeOut' | 'shake';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'characterEffect';
                category: 'character';
                orderIndex: string;
                characterId: number;
                effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCG';
                category: 'cg';
                orderIndex: string;
                cgImageId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCG';
                category: 'cg';
                orderIndex: string;
                transitionDuration: (number | string);
            })>;
        });
    }> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/games/{gameId}/scenes/{sceneId}',
            path: {
                'gameId': gameId,
                'sceneId': sceneId,
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
     * シーンを削除します。
     * @param gameId
     * @param sceneId
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiV1GamesScenes(
        gameId: (number | string),
        sceneId: (number | string),
        requestBody?: any,
    ): CancelablePromise<{
        success: boolean;
    }> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/games/{gameId}/scenes/{sceneId}',
            path: {
                'gameId': gameId,
                'sceneId': sceneId,
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
     * シーンを作成します。
     * @param gameId
     * @param requestBody
     * @returns any Created Scene
     * @throws ApiError
     */
    public postApiV1GamesScenes(
        gameId: (number | string),
        requestBody?: {
            name: string;
            fromScene: {
                id: number;
                sceneType: 'choice' | 'goto' | 'end';
                choices?: Array<{
                    id: number;
                    text: string;
                    nextSceneId?: number;
                }>;
                nextSceneId?: number;
            };
            choiceId?: number;
        },
    ): CancelablePromise<{
        success: boolean;
        data: ({
            id: number;
            name: string;
            sceneType: 'goto';
            events: Array<({
                id: number;
                eventType: 'textRender';
                category: 'message';
                orderIndex: string;
                text: string;
                characterName?: string | null;
            } | {
                id: number;
                eventType: 'appearMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                characterImageId: number;
                position: any[];
                scale: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideAllCharacters';
                category: 'character';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'moveCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                position: any[];
                scale: (number | string);
            } | {
                id: number;
                eventType: 'bgmStart';
                category: 'media';
                orderIndex: string;
                bgmId: number;
                loop: boolean;
                volume: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'bgmStop';
                category: 'media';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'soundEffect';
                category: 'media';
                orderIndex: string;
                volume: (number | string);
                loop: boolean;
                soundEffectId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'changeBackground';
                category: 'background';
                orderIndex: string;
                backgroundId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'effect';
                category: 'effect';
                orderIndex: string;
                effectType: 'fadeIn' | 'fadeOut' | 'shake';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'characterEffect';
                category: 'character';
                orderIndex: string;
                characterId: number;
                effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCG';
                category: 'cg';
                orderIndex: string;
                cgImageId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCG';
                category: 'cg';
                orderIndex: string;
                transitionDuration: (number | string);
            })>;
            nextSceneId: number;
        } | {
            id: number;
            name: string;
            sceneType: 'choice';
            events: Array<({
                id: number;
                eventType: 'textRender';
                category: 'message';
                orderIndex: string;
                text: string;
                characterName?: string | null;
            } | {
                id: number;
                eventType: 'appearMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                characterImageId: number;
                position: any[];
                scale: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideAllCharacters';
                category: 'character';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'moveCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                position: any[];
                scale: (number | string);
            } | {
                id: number;
                eventType: 'bgmStart';
                category: 'media';
                orderIndex: string;
                bgmId: number;
                loop: boolean;
                volume: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'bgmStop';
                category: 'media';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'soundEffect';
                category: 'media';
                orderIndex: string;
                volume: (number | string);
                loop: boolean;
                soundEffectId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'changeBackground';
                category: 'background';
                orderIndex: string;
                backgroundId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'effect';
                category: 'effect';
                orderIndex: string;
                effectType: 'fadeIn' | 'fadeOut' | 'shake';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'characterEffect';
                category: 'character';
                orderIndex: string;
                characterId: number;
                effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCG';
                category: 'cg';
                orderIndex: string;
                cgImageId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCG';
                category: 'cg';
                orderIndex: string;
                transitionDuration: (number | string);
            })>;
            choices: Array<{
                id: number;
                text: string;
                nextSceneId: number;
            }>;
        } | {
            id: number;
            name: string;
            sceneType: 'end';
            events: Array<({
                id: number;
                eventType: 'textRender';
                category: 'message';
                orderIndex: string;
                text: string;
                characterName?: string | null;
            } | {
                id: number;
                eventType: 'appearMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                characterImageId: number;
                position: any[];
                scale: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideAllCharacters';
                category: 'character';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'moveCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                position: any[];
                scale: (number | string);
            } | {
                id: number;
                eventType: 'bgmStart';
                category: 'media';
                orderIndex: string;
                bgmId: number;
                loop: boolean;
                volume: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'bgmStop';
                category: 'media';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'soundEffect';
                category: 'media';
                orderIndex: string;
                volume: (number | string);
                loop: boolean;
                soundEffectId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'changeBackground';
                category: 'background';
                orderIndex: string;
                backgroundId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'effect';
                category: 'effect';
                orderIndex: string;
                effectType: 'fadeIn' | 'fadeOut' | 'shake';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'characterEffect';
                category: 'character';
                orderIndex: string;
                characterId: number;
                effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCG';
                category: 'cg';
                orderIndex: string;
                cgImageId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCG';
                category: 'cg';
                orderIndex: string;
                transitionDuration: (number | string);
            })>;
        });
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/games/{gameId}/scenes',
            path: {
                'gameId': gameId,
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
     * シーンの設定を更新します。
     * @param gameId
     * @param sceneId
     * @param requestBody
     * @returns any Updated Scene
     * @throws ApiError
     */
    public putApiV1GamesScenesSetting(
        gameId: (number | string),
        sceneId: (number | string),
        requestBody?: {
            name: string;
        },
    ): CancelablePromise<{
        success: boolean;
        data: ({
            id: number;
            name: string;
            sceneType: 'goto';
            events: Array<({
                id: number;
                eventType: 'textRender';
                category: 'message';
                orderIndex: string;
                text: string;
                characterName?: string | null;
            } | {
                id: number;
                eventType: 'appearMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                characterImageId: number;
                position: any[];
                scale: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideAllCharacters';
                category: 'character';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'moveCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                position: any[];
                scale: (number | string);
            } | {
                id: number;
                eventType: 'bgmStart';
                category: 'media';
                orderIndex: string;
                bgmId: number;
                loop: boolean;
                volume: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'bgmStop';
                category: 'media';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'soundEffect';
                category: 'media';
                orderIndex: string;
                volume: (number | string);
                loop: boolean;
                soundEffectId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'changeBackground';
                category: 'background';
                orderIndex: string;
                backgroundId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'effect';
                category: 'effect';
                orderIndex: string;
                effectType: 'fadeIn' | 'fadeOut' | 'shake';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'characterEffect';
                category: 'character';
                orderIndex: string;
                characterId: number;
                effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCG';
                category: 'cg';
                orderIndex: string;
                cgImageId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCG';
                category: 'cg';
                orderIndex: string;
                transitionDuration: (number | string);
            })>;
            nextSceneId: number;
        } | {
            id: number;
            name: string;
            sceneType: 'choice';
            events: Array<({
                id: number;
                eventType: 'textRender';
                category: 'message';
                orderIndex: string;
                text: string;
                characterName?: string | null;
            } | {
                id: number;
                eventType: 'appearMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                characterImageId: number;
                position: any[];
                scale: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideAllCharacters';
                category: 'character';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'moveCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                position: any[];
                scale: (number | string);
            } | {
                id: number;
                eventType: 'bgmStart';
                category: 'media';
                orderIndex: string;
                bgmId: number;
                loop: boolean;
                volume: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'bgmStop';
                category: 'media';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'soundEffect';
                category: 'media';
                orderIndex: string;
                volume: (number | string);
                loop: boolean;
                soundEffectId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'changeBackground';
                category: 'background';
                orderIndex: string;
                backgroundId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'effect';
                category: 'effect';
                orderIndex: string;
                effectType: 'fadeIn' | 'fadeOut' | 'shake';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'characterEffect';
                category: 'character';
                orderIndex: string;
                characterId: number;
                effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCG';
                category: 'cg';
                orderIndex: string;
                cgImageId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCG';
                category: 'cg';
                orderIndex: string;
                transitionDuration: (number | string);
            })>;
            choices: Array<{
                id: number;
                text: string;
                nextSceneId: number;
            }>;
        } | {
            id: number;
            name: string;
            sceneType: 'end';
            events: Array<({
                id: number;
                eventType: 'textRender';
                category: 'message';
                orderIndex: string;
                text: string;
                characterName?: string | null;
            } | {
                id: number;
                eventType: 'appearMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideMessageWindow';
                category: 'message';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                characterImageId: number;
                position: any[];
                scale: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideAllCharacters';
                category: 'character';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'moveCharacter';
                category: 'character';
                orderIndex: string;
                characterId: number;
                position: any[];
                scale: (number | string);
            } | {
                id: number;
                eventType: 'bgmStart';
                category: 'media';
                orderIndex: string;
                bgmId: number;
                loop: boolean;
                volume: (number | string);
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'bgmStop';
                category: 'media';
                orderIndex: string;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'soundEffect';
                category: 'media';
                orderIndex: string;
                volume: (number | string);
                loop: boolean;
                soundEffectId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'changeBackground';
                category: 'background';
                orderIndex: string;
                backgroundId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'effect';
                category: 'effect';
                orderIndex: string;
                effectType: 'fadeIn' | 'fadeOut' | 'shake';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'characterEffect';
                category: 'character';
                orderIndex: string;
                characterId: number;
                effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'appearCG';
                category: 'cg';
                orderIndex: string;
                cgImageId: number;
                transitionDuration: (number | string);
            } | {
                id: number;
                eventType: 'hideCG';
                category: 'cg';
                orderIndex: string;
                transitionDuration: (number | string);
            })>;
        });
    }> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/games/{gameId}/scenes/{sceneId}/setting',
            path: {
                'gameId': gameId,
                'sceneId': sceneId,
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
     * イベントを作成します。
     * @param gameId
     * @param sceneId
     * @param requestBody
     * @returns any Created Event
     * @throws ApiError
     */
    public postApiV1GamesScenesEvents(
        gameId: (number | string),
        sceneId: (number | string),
        requestBody?: {
            type: 'textRender' | 'appearMessageWindow' | 'hideMessageWindow' | 'appearCharacter' | 'hideCharacter' | 'hideAllCharacters' | 'moveCharacter' | 'bgmStart' | 'bgmStop' | 'soundEffect' | 'changeBackground' | 'effect' | 'characterEffect' | 'appearCG' | 'hideCG';
            orderIndex: string;
        },
    ): CancelablePromise<{
        success: boolean;
        data: {
            id: number;
            eventType: 'textRender' | 'appearMessageWindow' | 'hideMessageWindow' | 'appearCharacter' | 'hideCharacter' | 'hideAllCharacters' | 'moveCharacter' | 'bgmStart' | 'bgmStop' | 'soundEffect' | 'changeBackground' | 'effect' | 'characterEffect' | 'appearCG' | 'hideCG';
            category: string;
            orderIndex: string;
        };
    }> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/games/{gameId}/scenes/{sceneId}/events',
            path: {
                'gameId': gameId,
                'sceneId': sceneId,
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
     * イベントの順序を変更します。
     * @param gameId
     * @param sceneId
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public putApiV1GamesScenesEventsMove(
        gameId: (number | string),
        sceneId: (number | string),
        requestBody?: {
            eventId: number;
            newOrderIndex: string;
        },
    ): CancelablePromise<{
        success: boolean;
    }> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/games/{gameId}/scenes/{sceneId}/events/move',
            path: {
                'gameId': gameId,
                'sceneId': sceneId,
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
     * イベントを更新します。
     * @param gameId
     * @param sceneId
     * @param eventId
     * @param requestBody
     * @returns any Updated Event
     * @throws ApiError
     */
    public putApiV1GamesScenesEvents(
        gameId: (number | string),
        sceneId: (number | string),
        eventId: (number | string),
        requestBody?: ({
            id: number;
            eventType: 'textRender';
            category: 'message';
            orderIndex: string;
            text: string;
            characterName?: string | null;
        } | {
            id: number;
            eventType: 'appearMessageWindow';
            category: 'message';
            orderIndex: string;
            transitionDuration: (number | string);
        } | {
            id: number;
            eventType: 'hideMessageWindow';
            category: 'message';
            orderIndex: string;
            transitionDuration: (number | string);
        } | {
            id: number;
            eventType: 'appearCharacter';
            category: 'character';
            orderIndex: string;
            characterId: number;
            characterImageId: number;
            position: any[];
            scale: (number | string);
            transitionDuration: (number | string);
        } | {
            id: number;
            eventType: 'hideCharacter';
            category: 'character';
            orderIndex: string;
            characterId: number;
            transitionDuration: (number | string);
        } | {
            id: number;
            eventType: 'hideAllCharacters';
            category: 'character';
            orderIndex: string;
            transitionDuration: (number | string);
        } | {
            id: number;
            eventType: 'moveCharacter';
            category: 'character';
            orderIndex: string;
            characterId: number;
            position: any[];
            scale: (number | string);
        } | {
            id: number;
            eventType: 'bgmStart';
            category: 'media';
            orderIndex: string;
            bgmId: number;
            loop: boolean;
            volume: (number | string);
            transitionDuration: (number | string);
        } | {
            id: number;
            eventType: 'bgmStop';
            category: 'media';
            orderIndex: string;
            transitionDuration: (number | string);
        } | {
            id: number;
            eventType: 'soundEffect';
            category: 'media';
            orderIndex: string;
            volume: (number | string);
            loop: boolean;
            soundEffectId: number;
            transitionDuration: (number | string);
        } | {
            id: number;
            eventType: 'changeBackground';
            category: 'background';
            orderIndex: string;
            backgroundId: number;
            transitionDuration: (number | string);
        } | {
            id: number;
            eventType: 'effect';
            category: 'effect';
            orderIndex: string;
            effectType: 'fadeIn' | 'fadeOut' | 'shake';
            transitionDuration: (number | string);
        } | {
            id: number;
            eventType: 'characterEffect';
            category: 'character';
            orderIndex: string;
            characterId: number;
            effectType: 'shake' | 'flash' | 'bounce' | 'sway' | 'wobble' | 'blackOn' | 'blackOff';
            transitionDuration: (number | string);
        } | {
            id: number;
            eventType: 'appearCG';
            category: 'cg';
            orderIndex: string;
            cgImageId: number;
            transitionDuration: (number | string);
        } | {
            id: number;
            eventType: 'hideCG';
            category: 'cg';
            orderIndex: string;
            transitionDuration: (number | string);
        }),
    ): CancelablePromise<{
        success: boolean;
        data: {
            id: number;
            eventType: 'textRender' | 'appearMessageWindow' | 'hideMessageWindow' | 'appearCharacter' | 'hideCharacter' | 'hideAllCharacters' | 'moveCharacter' | 'bgmStart' | 'bgmStop' | 'soundEffect' | 'changeBackground' | 'effect' | 'characterEffect' | 'appearCG' | 'hideCG';
            category: string;
            orderIndex: string;
        };
    }> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/games/{gameId}/scenes/{sceneId}/events/{eventId}',
            path: {
                'gameId': gameId,
                'sceneId': sceneId,
                'eventId': eventId,
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
     * イベントを削除します。
     * @param gameId
     * @param sceneId
     * @param eventId
     * @param requestBody
     * @returns any Success
     * @throws ApiError
     */
    public deleteApiV1GamesScenesEvents(
        gameId: (number | string),
        sceneId: (number | string),
        eventId: (number | string),
        requestBody?: any,
    ): CancelablePromise<{
        success: boolean;
    }> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/games/{gameId}/scenes/{sceneId}/events/{eventId}',
            path: {
                'gameId': gameId,
                'sceneId': sceneId,
                'eventId': eventId,
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
}
