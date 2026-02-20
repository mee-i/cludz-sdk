import type { Cludz } from "../index";
import type { ApiResponse, TaskResult } from "../types";

/**
 * Module for downloading media from various platforms.
 */
export class Downloader {
    /** @internal */
    constructor(private sdk: Cludz) {}

    /**
     * YouTube-specific download and search methods.
     */
    public readonly youtube = {
        /**
         * Search for YouTube videos.
         * @param query The search query.
         * @param limit Maximum number of results to return (default: 1).
         * @returns A promise that resolves to the search results.
         */
        search: (query: string, limit: number = 1): Promise<ApiResponse<TaskResult>> => {
            return this.sdk._request("/v1/youtube/search", {
                query: { query, limit }
            }) as Promise<ApiResponse<TaskResult>>;
        },

        /**
         * Download a YouTube video by search query (directs to the first result).
         * @param query The search query.
         * @param format The desired output format ("mp3" or "mp4"). Defaults to "mp4".
         * @returns A promise that resolves to the task information.
         */
        searchDownload: (query: string, format: "mp3" | "mp4" = "mp4"): Promise<ApiResponse<TaskResult>> => {
            return this.sdk._request("/v1/youtube/search/download", {
                query: { query, format }
            }) as Promise<ApiResponse<TaskResult>>;
        },

        /**
         * Download a YouTube video by its URL.
         * @param url The valid YouTube video URL.
         * @param format The desired output format ("mp3" or "mp4"). Defaults to "mp4".
         * @returns A promise that resolves to the task information.
         */
        download: (url: string, format: "mp3" | "mp4" = "mp4"): Promise<ApiResponse<TaskResult>> => {
            return this.sdk._request("/v1/youtube/download", {
                query: { url, format }
            }) as Promise<ApiResponse<TaskResult>>;
        }
    };

    /**
     * TikTok-specific download methods.
     */
    public readonly tiktok = {
        /**
         * Download a TikTok video or audio.
         * @param url The valid TikTok video URL.
         * @param format The desired output format ("mp3" or "mp4"). Defaults to "mp4".
         * @returns A promise that resolves to the task information.
         */
        download: (url: string, format: "mp3" | "mp4" = "mp4"): Promise<ApiResponse<TaskResult>> => {
            return this.sdk._request("/v1/tiktok/download", {
                query: { url, format }
            }) as Promise<ApiResponse<TaskResult>>;
        }
    };

    /**
     * Generic downloader for other platforms.
     * @param platform The platform identifier (e.g., "instagram", "facebook").
     * @param url The media URL.
     * @param format The desired output format ("mp3" or "mp4"). Defaults to "mp4".
     * @returns A promise that resolves to the task information.
     */
    async download(platform: string, url: string, format: "mp3" | "mp4" = "mp4"): Promise<ApiResponse<TaskResult>> {
        return this.sdk._request(`/v1/${platform}/download`, {
            query: { url, format }
        }) as Promise<ApiResponse<TaskResult>>;
    }
}
