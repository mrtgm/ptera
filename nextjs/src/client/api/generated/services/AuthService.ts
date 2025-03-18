/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * ログインユーザー情報を取得します。
     * @returns any User information
     * @throws ApiError
     */
    public getApiV1AuthMe(): CancelablePromise<{
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
            method: 'GET',
            url: '/api/v1/auth/me',
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
     * ログアウトします。
     * @returns any Logout success
     * @throws ApiError
     */
    public getApiV1AuthLogout(): CancelablePromise<{
        success: boolean;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/logout',
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
     * Googleアカウントでログインします。
     * @returns void
     * @throws ApiError
     */
    public getApiV1AuthGoogle(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/auth/google',
            errors: {
                302: `Redirect to original URL or top page on success`,
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
