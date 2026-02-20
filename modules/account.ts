import type { Cludz } from "../index";
import type { ApiResponse, AccountInfo, MonitoringStats } from "../types";

/**
 * Module for account management and status monitoring.
 */
export class Account {
    /** @internal */
    constructor(private sdk: Cludz) {}

    /**
     * Retrieves current account information and API key details.
     * @returns A promise that resolves to the account information.
     */
    async me(): Promise<ApiResponse<AccountInfo>> {
        return this.sdk._request("/v1/me") as Promise<ApiResponse<AccountInfo>>;
    }

    /**
     * Retrieves API status and overall monitoring statistics.
     * @returns A promise that resolves to the monitoring statistics.
     */
    async status(): Promise<MonitoringStats> {
        return this.sdk._request("/monitoring/stats") as Promise<MonitoringStats>;
    }
}
