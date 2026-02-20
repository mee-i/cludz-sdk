/**
 * Options for initializing the Cludz client.
 */
export interface CludzOptions {
    /** The base URL of the Cludz API. */
    api: string;
    /** The API key for authentication. */
    key?: string;
}

/**
 * Standard API response wrapper.
 * @template T The type of the data returned by the API.
 */
export interface ApiResponse<T = any> {
    /** HTTP status code. */
    statusCode: number;
    /** Short description of the status. */
    statusMessage: string;
    /** Detailed message from the server. */
    message: string;
    /** The actual response data. */
    data: T;
}

/**
 * Options for making an internal SDK request.
 */
export interface RequestOptions {
    /** The HTTP method to use. */
    method?: "GET" | "POST" | "PUT" | "DELETE";
    /** URL query parameters. */
    query?: Record<string, any>;
    /** Request body data. */
    body?: any;
}

/**
 * Information about the current account and API key.
 */
export interface AccountInfo {
    /** Account details. */
    account: {
        /** Unique account identifier. */
        id: string;
    };
    /** API key details. */
    token: {
        /** Name of the API key. */
        name: string;
        /** Total number of requests made with this key. */
        total_requests: number;
        /** Last time the key was used. */
        last_used_at: string | null;
        /** When the key was created. */
        created_at: string;
    };
    /** License details. */
    license: {
        /** License name. */
        name: string;
        /** Whether the license is currently active. */
        is_active: boolean;
        /** When the license expires. */
        expires_at: string | null;
    };
    /** Rate limiting details. */
    rate_limit: {
        /** Maximum requests allowed per minute. */
        limit_per_minute: number;
        /** Requests used in the current minute. */
        used_this_minute: number;
        /** Requests remaining for the current minute. */
        remaining: number;
        /** When the rate limit resets. */
        reset_at: string;
        /** Seconds remaining until the rate limit resets. */
        reset_in_seconds: number;
    };
}

/**
 * Statistics for API monitoring.
 */
export interface MonitoringStats {
    /** Total requests processed. */
    requests: number;
    /** Server uptime string. */
    uptime: string;
    /** Current error rate percentage. */
    error_rate: number;
    /** Average response time in milliseconds. */
    avg_response_time_ms: number;
    /** Timestamp of the statistics. */
    timestamp: string;
}

/**
 * Represents a single YouTube search result.
 */
export interface YouTubeSearchResult {
    /** YouTube video ID. */
    id: string;
    /** Video title. */
    title: string;
    /** YouTube video URL. */
    url: string;
    /** Thumbnail image URL. */
    thumbnail: string;
    /** Video description. */
    description: string;
    /** Duration in seconds. */
    duration: number;
    /** Formatted duration string (e.g., "3:45"). */
    duration_string: string;
    /** Number of views. */
    views: number;
    /** URL of the video webpage. */
    webpage_url: string;
}

/**
 * List of YouTube search results.
 */
export interface YouTubeSearchList {
    /** Number of results returned. */
    count: number;
    /** The list of search results. */
    list: YouTubeSearchResult[];
}

/**
 * Result of a media download request.
 */
export interface DownloadResult {
    /** The URL where the media can be downloaded. */
    download_url: string;
}

/**
 * Result of a web connectivity check.
 */
export interface WebCheckResult {
    /** HTTP status code of the target URL. */
    status: number;
    /** HTTP status text. */
    statusText: string;
    /** Content type of the response. */
    contentType: string;
    /** Latency in a human-readable format. */
    latency: string;
}

/**
 * DNS lookup results.
 */
export interface DnsResult {
    /** A (IPv4) records. */
    A?: string[];
    /** AAAA (IPv6) records. */
    AAAA?: string[];
    /** MX (Mail Exchange) records. */
    MX?: { exchange: string; priority: number }[];
    /** TXT (Text) records. */
    TXT?: string[][];
    /** NS (Name Server) records. */
    NS?: string[];
}

/**
 * SSL certificate information.
 */
export interface SslResult {
    /** Certificate subject. */
    subject: any;
    /** Certificate issuer. */
    issuer: any;
    /** Start of validity period. */
    valid_from: string;
    /** End of validity period. */
    valid_to: string;
    /** Days remaining until expiration. */
    remaining_days: number;
}

/**
 * Result of starting a background task.
 */
export interface TaskResult {
    /** Unique task identifier. */
    taskId: string;
    /** URL to poll for task status. */
    status_url: string;
}

/**
 * Current state of a background task.
 * @template T The type of the result data when the task is completed.
 */
export interface TaskState<T = any> {
    /** Unique task identifier. */
    id: string;
    /** User ID associated with the task, if any. */
    user_id: string | null;
    /** Current status of the task. */
    status: "Pending" | "Processing" | "Completed" | "Failed";
    /** Progress percentage (0-100). */
    progress: number;
    /** Status message or update. */
    message: string | null;
    /** Final task result data. */
    data: T | null;
    /** Error message if the task failed. */
    error: string | null;
    /** When the task was created. */
    created_at: string;
    /** When the task was last updated. */
    updated_at: string;
}

/**
 * Options for initializing a Storage instance.
 */
export interface StorageOptions {
    /** The base URL of the Cludz Storage API. */
    api: string;
    /** The storage container identifier. */
    id: string;
    /** The access token for this storage container. */
    token: string;
}

/**
 * Information about a file or directory in storage.
 */
export interface FileInfo {
    /** Name of the item. */
    name: string;
    /** Size in bytes. */
    size: number;
    /** Whether the item is a directory. */
    isDirectory: boolean;
    /** Item checksum for integrity verification. */
    checksum: string;
    /** When the item was created. */
    created_at: string;
    /** When the item was last modified. */
    modified_at: string;
}
