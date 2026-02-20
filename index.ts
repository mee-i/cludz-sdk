// import { AI } from "./modules/ai";
import { Downloader } from "./modules/downloader";
import { Tools } from "./modules/tools";
import { Account } from "./modules/account";
import { Image } from "./modules/image";
import { Tasks } from "./modules/tasks";
export { Storage } from "./modules/storage";
export type { StorageSource } from "./modules/storage";

import type { CludzOptions, RequestOptions } from "./types";

/**
 * The main Cludz SDK client.
 * Provides access to various modules including downloader, tools, account, image, and tasks.
 */
export class Cludz {
    /** The base URL of the Cludz API. */
    public readonly baseUrl: string;
    /** The API key used for authentication. */
    public readonly key?: string;
    
    // public readonly ai: AI;
    /** Module for downloading media from supported platforms. */
    public readonly downloader: Downloader;
    /** Module for various utility tools (QR, DNS, SSL, etc.). */
    public readonly tools: Tools;
    /** Module for account management and status monitoring. */
    public readonly account: Account;
    /** Module for image processing and manipulation. */
    public readonly image: Image;
    /** Module for managing and waiting for background tasks. */
    public readonly tasks: Tasks;

    /**
     * Initializes a new instance of the Cludz client.
     * @param options Configuration options for the client.
     * @throws Error if the API URL is not provided.
     */
    constructor(options: CludzOptions) {
        if (!options.api) throw new Error("API URL is required");
        
        this.baseUrl = options.api.replace(/\/$/, "");
        this.key = options.key;

        // this.ai = new AI(this);
        this.downloader = new Downloader(this);
        this.tools = new Tools(this);
        this.account = new Account(this);
        this.image = new Image(this);
        this.tasks = new Tasks(this);
    }

    /**
     * Internal request handler using fetch.
     * @param endpoint The API endpoint to request (e.g., "/v1/youtube/download").
     * @param options Request configuration including method, query params, and body.
     * @returns A promise that resolves to the parsed JSON data or a Response object for binary content.
     * @throws Error if the API returns a non-OK response.
     * @internal
     */
    async _request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T | Response> {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        
        if (options.query) {
            Object.entries(options.query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value.toString());
                }
            });
        }

        const headers: Record<string, string> = {
            "Accept": "application/json",
        };

        if (this.key) {
            headers["X-API-Key"] = this.key;
        }

        const fetchOptions: RequestInit = {
            method: options.method || "GET",
            headers,
        };

        if (options.body) {
            if (options.body instanceof FormData) {
                fetchOptions.body = options.body;
                // Don't set Content-Type, fetch will set it with boundary
            } else {
                fetchOptions.body = JSON.stringify(options.body);
                headers["Content-Type"] = "application/json";
            }
        }

        const response = await fetch(url.toString(), fetchOptions);
        
        const contentType = response.headers.get("content-type");
        if (contentType && (contentType.includes("image/") || contentType.includes("application/pdf"))) {
            return response;
        }

        const data = await response.json() as any;

        if (!response.ok) {
            throw new Error(data.message || data.statusMessage || `API Error: ${response.status}`);
        }

        return data as T;
    }
}