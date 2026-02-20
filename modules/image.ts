import type { Cludz } from "../index";

/**
 * Supported image source types.
 * Can be a URL string, a local file path string, a Buffer, a Blob, or a File.
 */
export type ImageSource = string | Buffer | Blob | File;

/**
 * Module for image processing and manipulation.
 * Supports environment-agnostic file resolution (Bun and Node.js).
 */
export class Image {
    /** @internal */
    constructor(private sdk: Cludz) {}

    /**
     * Resolves various image sources into a Blob or URL string.
     * @param source The image source to resolve.
     * @returns A promise that resolves to a Blob or a URL string.
     * @private
     */
    private async resolveImage(source: ImageSource): Promise<Blob | string> {
        if (typeof source === "string") {
            if (source.startsWith("http://") || source.startsWith("https://")) {
                return source;
            } else {
                // Assume local path - dynamic import to stay environment-agnostic where possible
                try {
                    // Try Bun first as it's the primary environment
                    // @ts-ignore
                    if (typeof Bun !== "undefined") {
                        // @ts-ignore
                        return Bun.file(source).blob();
                    }
                    // Fallback to Node.js
                    const { readFile } = await import("node:fs/promises");
                    const buffer = await readFile(source);
                    return new Blob([buffer]);
                } catch (error: any) {
                    throw new Error(`Failed to read local image path: ${error.message}`);
                }
            }
        }
        
        if (source instanceof Blob || (typeof File !== "undefined" && source instanceof File)) {
            return source;
        }

        if (Buffer.isBuffer(source)) {
            return new Blob([source]);
        }

        throw new Error("Invalid image source type. Supported: URL string, local path string, Buffer, or Blob/File.");
    }

    /**
     * Generates a meme by adding text to an image.
     * @param source The image source (URL, path, Buffer, Blob, or File).
     * @param top The text to display at the top of the meme.
     * @param bottom The text to display at the bottom of the meme.
     * @returns A promise that resolves to a Response object containing the generated image.
     */
    async meme(source: ImageSource, top?: string, bottom?: string): Promise<Response> {
        const image = await this.resolveImage(source);
        const formData = new FormData();
        
        if (typeof image === "string") {
            formData.append("image", image);
        } else {
            formData.append("image", image, "image.png");
        }

        if (top) formData.append("top", top);
        if (bottom) formData.append("bottom", bottom);

        return this.sdk._request("/v1/image/meme", {
            method: "POST",
            body: formData
        }) as Promise<Response>;
    }

    /**
     * Compresses an image to reduce its file size.
     * @param source The image source (URL, path, Buffer, Blob, or File).
     * @param quality Compression quality (1-100). Defaults to 80.
     * @returns A promise that resolves to a Response object containing the compressed image.
     */
    async compress(source: ImageSource, quality: number = 80): Promise<Response> {
        const image = await this.resolveImage(source);
        const formData = new FormData();

        if (typeof image === "string") {
            formData.append("image", image);
        } else {
            formData.append("image", image, "image.png");
        }

        formData.append("quality", quality.toString());

        return this.sdk._request("/v1/image/compress", {
            method: "POST",
            body: formData
        }) as Promise<Response>;
    }

    /**
     * Converts an image to a different format.
     * @param source The image source (URL, path, Buffer, Blob, or File).
     * @param format The target image format.
     * @returns A promise that resolves to a Response object containing the converted image.
     */
    async convert(source: ImageSource, format: "jpeg" | "jpg" | "png" | "webp" | "avif"): Promise<Response> {
        const image = await this.resolveImage(source);
        const formData = new FormData();

        if (typeof image === "string") {
            formData.append("image", image);
        } else {
            formData.append("image", image, "image.png");
        }

        formData.append("format", format);

        return this.sdk._request("/v1/image/convert", {
            method: "POST",
            body: formData
        }) as Promise<Response>;
    }

    /**
     * Crops an image to specific dimensions.
     * @param source The image source (URL, path, Buffer, Blob, or File).
     * @param options The crop dimensions (left, top, width, height).
     * @returns A promise that resolves to a Response object containing the cropped image.
     */
    async crop(source: ImageSource, options: { left: number; top: number; width: number; height: number }): Promise<Response> {
        const image = await this.resolveImage(source);
        const formData = new FormData();

        if (typeof image === "string") {
            formData.append("image", image);
        } else {
            formData.append("image", image, "image.png");
        }

        formData.append("left", options.left.toString());
        formData.append("top", options.top.toString());
        formData.append("width", options.width.toString());
        formData.append("height", options.height.toString());

        return this.sdk._request("/v1/image/crop", {
            method: "POST",
            body: formData
        }) as Promise<Response>;
    }
}
