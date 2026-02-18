import type { Cludz } from "../index";
import type { ApiResponse, WebCheckResult, DnsResult, SslResult } from "../types";

export interface BarcodeOptions {
    type?: string;
    showText?: boolean;
    scale?: number;
    height?: number;
}

export class Tools {
    constructor(private sdk: Cludz) {}

    /**
     * Perform a web check on a URL
     */
    async webCheck(url: string): Promise<ApiResponse<WebCheckResult>> {
        return this.sdk._request("/v1/tools/web-check", {
            query: { url }
        }) as Promise<ApiResponse<WebCheckResult>>;
    }

    /**
     * Get DNS records for a domain
     */
    async dns(domain: string): Promise<ApiResponse<DnsResult>> {
        return this.sdk._request("/v1/tools/dns", {
            query: { domain }
        }) as Promise<ApiResponse<DnsResult>>;
    }

    /**
     * Get SSL information for a domain
     */
    async ssl(domain: string): Promise<ApiResponse<SslResult>> {
        return this.sdk._request("/v1/tools/ssl", {
            query: { domain }
        }) as Promise<ApiResponse<SslResult>>;
    }

    /**
     * Get metadata/OpenGraph info for a URL
     */
    async meta(url: string): Promise<ApiResponse> {
        return this.sdk._request("/v1/tools/meta", {
            query: { url }
        }) as Promise<ApiResponse>;
    }

    /**
     * Generate a QR Code
     */
    async qr(text: string): Promise<Response> {
        return this.sdk._request("/v1/tools/qr", {
            query: { text }
        }) as Promise<Response>;
    }

    /**
     * Generate a Barcode
     */
    async barcode(text: string, options: BarcodeOptions = {}): Promise<Response> {
        return this.sdk._request("/v1/tools/barcode", {
            query: {
                text,
                type: options.type,
                show_text: options.showText ?? true,
                scale: options.scale,
                height: options.height
            }
        }) as Promise<Response>;
    }
}
