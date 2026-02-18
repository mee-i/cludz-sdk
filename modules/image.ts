import type { Cludz } from "../index";

export type ImageSource = string | Buffer | Blob | File;

export class Image {
    constructor(private sdk: Cludz) {}

    /**
     * Resolves various image sources into a Blob or URL string
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
     * Generate a meme from an image
     * @param source Image source (URL, path, Buffer, Blob)
     * @param top Top text
     * @param bottom Bottom text
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
     * Compress an image
     * @param source Image source (URL, path, Buffer, Blob)
     * @param quality Compression quality (1-100)
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
     * Convert an image format
     * @param source Image source (URL, path, Buffer, Blob)
     * @param format Target format
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
     * Crop an image
     * @param source Image source (URL, path, Buffer, Blob)
     * @param options Crop dimensions
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
