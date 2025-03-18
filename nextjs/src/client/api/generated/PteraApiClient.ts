/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AssetsService } from './services/AssetsService';
import { AuthService } from './services/AuthService';
import { CharactersService } from './services/CharactersService';
import { DashboardService } from './services/DashboardService';
import { GamesService } from './services/GamesService';
import { UsersService } from './services/UsersService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class PteraApiClient {
    public readonly assets: AssetsService;
    public readonly auth: AuthService;
    public readonly characters: CharactersService;
    public readonly dashboard: DashboardService;
    public readonly games: GamesService;
    public readonly users: UsersService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '1',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.assets = new AssetsService(this.request);
        this.auth = new AuthService(this.request);
        this.characters = new CharactersService(this.request);
        this.dashboard = new DashboardService(this.request);
        this.games = new GamesService(this.request);
        this.users = new UsersService(this.request);
    }
}

