import type { Cludz } from "../index";
import type { ApiResponse } from "../types";

// AI is currently not available.
// /**
//  * Module for interacting with Cludz AI models.
//  */
// export class AI {
//     /** @internal */
//     constructor(private sdk: Cludz) {}

//     /**
//      * Sends a message to the Mimo AI model (Flash V2).
//      * @param text The message or prompt to send.
//      * @returns A promise that resolves to the AI's response text.
//      */
//     async mimo(text: string): Promise<ApiResponse<string>> {
//         return this.sdk._request("/v1/ai/mimo/chat", {
//             query: { text }
//         }) as Promise<ApiResponse<string>>;
//     }

//     /**
//      * Sends a message to the GPT AI model (OSS 120B).
//      * @param text The message or prompt to send.
//      * @returns A promise that resolves to the AI's response text.
//      */
//     async gpt(text: string): Promise<ApiResponse<string>> {
//         return this.sdk._request("/v1/ai/gpt/chat", {
//             query: { text }
//         }) as Promise<ApiResponse<string>>;
//     }
// }
