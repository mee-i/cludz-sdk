import type { Cludz } from "../index";
import type { ApiResponse, TaskResult } from "../types";

export class Downloader {
    constructor(private sdk: Cludz) {}

    public readonly youtube = {
        /**
         * Search for YouTube videos
         */
        search: (query: string, limit: number = 1): Promise<ApiResponse<TaskResult>> => {
            return this.sdk._request("/v1/youtube/search", {
                query: { query, limit }
            }) as Promise<ApiResponse<TaskResult>>;
        },

        /**
         * Download YouTube video by query (first result)
         */
        searchDownload: (query: string, format: "mp3" | "mp4" = "mp4"): Promise<ApiResponse<TaskResult>> => {
            return this.sdk._request("/v1/youtube/search/download", {
                query: { query, format }
            }) as Promise<ApiResponse<TaskResult>>;
        },

        /**
         * Download YouTube video by URL
         */
        download: (url: string, format: "mp3" | "mp4" = "mp4"): Promise<ApiResponse<TaskResult>> => {
            return this.sdk._request("/v1/youtube/download", {
                query: { url, format }
            }) as Promise<ApiResponse<TaskResult>>;
        }
    };

    public readonly tiktok = {
        /**
         * Download TikTok video/audio
         */
        download: (url: string, format: "mp3" | "mp4" = "mp4"): Promise<ApiResponse<TaskResult>> => {
            return this.sdk._request("/v1/tiktok/download", {
                query: { url, format }
            }) as Promise<ApiResponse<TaskResult>>;
        }
    };

    /**
     * Generic downloader for other platforms
     */
    async download(platform: string, url: string, format: "mp3" | "mp4" = "mp4"): Promise<ApiResponse<TaskResult>> {
        return this.sdk._request(`/v1/${platform}/download`, {
            query: { url, format }
        }) as Promise<ApiResponse<TaskResult>>;
    }
}
