import type { Cludz } from "../index";
import type { ApiResponse, AccountInfo, MonitoringStats } from "../types";

export class Account {
    constructor(private sdk: Cludz) {}

    /**
     * Get current account information
     */
    async me(): Promise<ApiResponse<AccountInfo>> {
        return this.sdk._request("/v1/me") as Promise<ApiResponse<AccountInfo>>;
    }

    /**
     * Get API status/monitoring info
     */
    async status(): Promise<MonitoringStats> {
        return this.sdk._request("/monitoring/stats") as Promise<MonitoringStats>;
    }
}
