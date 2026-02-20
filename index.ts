// import { AI } from "./modules/ai";
import { Downloader } from "./modules/downloader";
import { Tools } from "./modules/tools";
import { Account } from "./modules/account";
import { Image } from "./modules/image";
import { Tasks } from "./modules/tasks";
export { Storage } from "./modules/storage";
export type { StorageSource } from "./modules/storage";

import type { CludzOptions, RequestOptions } from "./types";

export class Cludz {
    public readonly baseUrl: string;
    public readonly key?: string;
    
    // public readonly ai: AI;
    public readonly downloader: Downloader;
    public readonly tools: Tools;
    public readonly account: Account;
    public readonly image: Image;
    public readonly tasks: Tasks;

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
     * Internal request handler using Bun fetch
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