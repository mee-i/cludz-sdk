import type { Cludz } from "../index";
import type { ApiResponse, YouTubeSearchList, DownloadResult } from "../types";

export class Downloader {
    constructor(private sdk: Cludz) {}

    public readonly youtube = {
        /**
         * Search for YouTube videos
         */
        search: (query: string, limit: number = 1): Promise<ApiResponse<YouTubeSearchList>> => {
            return this.sdk._request("/v1/youtube/search", {
                query: { query, limit }
            }) as Promise<ApiResponse<YouTubeSearchList>>;
        },

        /**
         * Download YouTube video by query (first result)
         */
        searchDownload: (query: string, format: "mp3" | "mp4" = "mp4"): Promise<ApiResponse<DownloadResult>> => {
            return this.sdk._request("/v1/youtube/search/download", {
                query: { query, format }
            }) as Promise<ApiResponse<DownloadResult>>;
        },

        /**
         * Download YouTube video by URL
         */
        download: (url: string, format: "mp3" | "mp4" = "mp4"): Promise<ApiResponse<DownloadResult>> => {
            return this.sdk._request("/v1/youtube/download", {
                query: { url, format }
            }) as Promise<ApiResponse<DownloadResult>>;
        }
    };

    public readonly tiktok = {
        /**
         * Download TikTok video/audio
         */
        download: (url: string, format: "mp3" | "mp4" = "mp4"): Promise<ApiResponse<DownloadResult>> => {
            return this.sdk._request("/v1/tiktok/download", {
                query: { url, format }
            }) as Promise<ApiResponse<DownloadResult>>;
        }
    };

    /**
     * Generic downloader for other platforms
     */
    async download(platform: string, url: string, format: "mp3" | "mp4" = "mp4"): Promise<ApiResponse<DownloadResult>> {
        return this.sdk._request(`/v1/${platform}/download`, {
            query: { url, format }
        }) as Promise<ApiResponse<DownloadResult>>;
    }
}
