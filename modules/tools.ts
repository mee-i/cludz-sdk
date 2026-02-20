import type { Cludz } from "../index";
import type { ApiResponse, WebCheckResult, DnsResult, SslResult } from "../types";

/**
 * Options for barcode generation.
 */
export interface BarcodeOptions {
    /** The barcode symbology type (e.g., "code128", "ean13"). */
    type?: string;
    /** Whether to show the text below the barcode. */
    showText?: boolean;
    /** Scaling factor for the barcode. */
    scale?: number;
    /** Height of the barcode in pixels. */
    height?: number;
}

/**
 * Module for various utility tools including network checks and media generation.
 */
export class Tools {
    /** @internal */
    constructor(private sdk: Cludz) {}

    /**
     * Performs a web connectivity check on a URL.
     * @param url The URL to check.
     * @returns A promise that resolves to the web check results.
     */
    async webCheck(url: string): Promise<ApiResponse<WebCheckResult>> {
        return this.sdk._request("/v1/tools/web-check", {
            query: { url }
        }) as Promise<ApiResponse<WebCheckResult>>;
    }

    /**
     * Retrieves DNS records for a specific domain.
     * @param domain The domain name to query.
     * @returns A promise that resolves to the DNS results.
     */
    async dns(domain: string): Promise<ApiResponse<DnsResult>> {
        return this.sdk._request("/v1/tools/dns", {
            query: { domain }
        }) as Promise<ApiResponse<DnsResult>>;
    }

    /**
     * Retrieves SSL certificate information for a domain.
     * @param domain The domain name to query.
     * @returns A promise that resolves to the SSL information.
     */
    async ssl(domain: string): Promise<ApiResponse<SslResult>> {
        return this.sdk._request("/v1/tools/ssl", {
            query: { domain }
        }) as Promise<ApiResponse<SslResult>>;
    }

    /**
     * Retrieves OpenGraph metadata for a given URL.
     * @param url The URL to analyze.
     * @returns A promise that resolves to the metadata.
     */
    async meta(url: string): Promise<ApiResponse> {
        return this.sdk._request("/v1/tools/meta", {
            query: { url }
        }) as Promise<ApiResponse>;
    }

    /**
     * Generates a QR Code image.
     * @param text The text or URL to encode in the QR code.
     * @returns A promise that resolves to a Response object containing the image.
     */
    async qr(text: string): Promise<Response> {
        return this.sdk._request("/v1/tools/qr", {
            query: { text }
        }) as Promise<Response>;
    }

    /**
     * Generates a Barcode image.
     * @param text The text to encode in the barcode.
     * @param options Configuration options for barcode generation.
     * @returns A promise that resolves to a Response object containing the image.
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
