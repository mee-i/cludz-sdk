export interface CludzOptions {
    api: string;
    token?: string;
}

export interface ApiResponse<T = any> {
    statusCode: number;
    statusMessage: string;
    message: string;
    data: T;
}

export interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    query?: Record<string, any>;
    body?: any;
}

export interface AccountInfo {
    account: {
        id: string;
    };
    token: {
        name: string;
        total_requests: number;
        last_used_at: string | null;
        created_at: string;
    };
    license: {
        name: string;
        is_active: boolean;
        expires_at: string | null;
    };
    rate_limit: {
        limit_per_minute: number;
        used_this_minute: number;
        remaining: number;
        reset_at: string;
        reset_in_seconds: number;
    };
}

export interface MonitoringStats {
    requests: number;
    uptime: string;
    error_rate: number;
    avg_response_time_ms: number;
    timestamp: string;
}

export interface YouTubeSearchResult {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    description: string;
    duration: number;
    duration_string: string;
    views: number;
    webpage_url: string;
}

export interface YouTubeSearchList {
    count: number;
    list: YouTubeSearchResult[];
}

export interface DownloadResult {
    download_url: string;
}

export interface WebCheckResult {
    status: number;
    statusText: string;
    contentType: string;
    latency: string;
}

export interface DnsResult {
    A?: string[];
    AAAA?: string[];
    MX?: { exchange: string; priority: number }[];
    TXT?: string[][];
    NS?: string[];
}

export interface SslResult {
    subject: any;
    issuer: any;
    valid_from: string;
    valid_to: string;
    remaining_days: number;
}
