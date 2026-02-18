import type { Cludz } from "../index";
import type { ApiResponse } from "../types";

export class AI {
    constructor(private sdk: Cludz) {}

    /**
     * Chat with Mimo (Flash V2)
     */
    async mimo(text: string): Promise<ApiResponse<string>> {
        return this.sdk._request("/v1/ai/mimo/chat", {
            query: { text }
        }) as Promise<ApiResponse<string>>;
    }

    /**
     * Chat with GPT (OSS 120B)
     */
    async gpt(text: string): Promise<ApiResponse<string>> {
        return this.sdk._request("/v1/ai/gpt/chat", {
            query: { text }
        }) as Promise<ApiResponse<string>>;
    }
}
