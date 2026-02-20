import type { StorageOptions, FileInfo } from "../types";

/**
 * Supported storage source types.
 * Can be a local file path string, a Buffer, a Blob, or a File.
 */
export type StorageSource = string | Buffer | Blob | File;

/**
 * Standalone module for interacting with Cludz Storage containers.
 */
export class Storage {
    /** The base URL of the storage container. */
    public readonly api: string;
    /** The storage container identifier. */
    public readonly id: string;
    /** The access token for this storage container. */
    public readonly token: string;

    /**
     * Initializes a new instance of the Storage client.
     * @param options Configuration options for the storage container.
     * @throws Error if any required option (api, id, token) is missing.
     */
    constructor(options: StorageOptions) {
        if (!options.api) throw new Error("API URL is required");
        if (!options.id) throw new Error("Storage ID is required");
        if (!options.token) throw new Error("Token is required");

        this.api = `${options.api.replace(/\/$/, "")}/storage/${options.id}`;
        this.id = options.id;
        this.token = options.token;
    }

    /**
     * Constructs headers for storage requests.
     * @param additional Optional additional headers.
     * @returns A record of headers.
     * @private
     */
    private getHeaders(additional: Record<string, string> = {}): Record<string, string> {
        return {
            Token: this.token,
            ...additional,
        };
    }

    /**
     * Normalizes a storage path by ensuring it starts with a slash.
     * @param p The path to normalize.
     * @returns The normalized path.
     * @private
     */
    private normalizePath(p: string): string {
        return p.startsWith("/") ? p : `/${p}`;
    }

    /**
     * Resolves various file sources into a Blob or File for FormData.
     * @param source The file source (path, Buffer, Blob, or File).
     * @param fileName Optional file name to use when resolving from generic sources.
     * @returns A promise that resolves to a Blob or File.
     * @private
     */
    private async resolveFile(source: StorageSource, fileName: string = "file"): Promise<Blob | File> {
        if (typeof source === "string") {
            try {
                // Try Bun first
                // @ts-ignore
                if (typeof Bun !== "undefined") {
                    // @ts-ignore
                    return Bun.file(source);
                }
                // Fallback to Node.js
                const { readFile } = await import("node:fs/promises");
                const buffer = await readFile(source);
                // Extract filename from path if not provided
                const name = fileName === "file" ? source.split(/[\\/]/).pop() || "file" : fileName;
                return new File([buffer], name);
            } catch (error: any) {
                throw new Error(`Failed to read local file path: ${error.message}`);
            }
        }

        if (source instanceof Blob || (typeof File !== "undefined" && source instanceof File)) {
            return source;
        }

        if (Buffer.isBuffer(source)) {
            return new Blob([source]);
        }

        throw new Error("Invalid file source type. Supported: local path string, Buffer, or Blob/File.");
    }

    /**
     * Uploads a file to a specific directory in the storage.
     * @param targetDirectory The target directory in storage (e.g., "/Documents").
     * @param source The file source (local path, Buffer, Blob, or File).
     * @param fileName Optional filename to use in storage.
     * @returns A promise that resolves when the upload is complete.
     * @throws Error if the upload fails.
     */
    async upload(targetDirectory: string, source: StorageSource, fileName?: string): Promise<void> {
        const url = `${this.api}${this.normalizePath(targetDirectory)}`;
        const fileObj = await this.resolveFile(source, fileName);
        
        const finalFileName = fileName || (fileObj instanceof File ? fileObj.name : "file");

        const formData = new FormData();
        formData.append("file", fileObj, finalFileName);

        const response = await fetch(url, {
            method: "POST",
            headers: this.getHeaders(),
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
        }
    }

    /**
     * Deletes a file or directory from the storage.
     * @param targetPath The path of the item to delete.
     * @returns A promise that resolves when the deletion is complete.
     * @throws Error if the deletion fails.
     */
    async delete(targetPath: string): Promise<void> {
        const url = `${this.api}${this.normalizePath(targetPath)}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Delete failed: ${response.status} ${response.statusText} - ${errorText}`);
        }
    }

    /**
     * Creates a new folder in the storage.
     * @param parentPath The path to the parent directory.
     * @param folderName The name of the new folder.
     * @returns A promise that resolves when the folder is created.
     * @throws Error if the folder creation fails.
     */
    async createFolder(parentPath: string, folderName: string): Promise<void> {
        const url = `${this.api}${this.normalizePath(parentPath)}`;
        const response = await fetch(url, {
            method: "POST",
            headers: this.getHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ type: "folder", name: folderName }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Create folder failed: ${response.status} ${response.statusText} - ${errorText}`);
        }
    }

    /**
     * Creates an empty file in the storage.
     * @param parentPath The path to the parent directory.
     * @param fileName The name of the new file.
     * @returns A promise that resolves when the file is created.
     * @throws Error if the file creation fails.
     */
    async createFile(parentPath: string, fileName: string): Promise<void> {
        const url = `${this.api}${this.normalizePath(parentPath)}`;
        const response = await fetch(url, {
            method: "POST",
            headers: this.getHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ type: "file", name: fileName }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Create file failed: ${response.status} ${response.statusText} - ${errorText}`);
        }
    }

    /**
     * Renames or moves a file or directory in the storage.
     * @param targetPath The current path of the item.
     * @param newName The new name for the item.
     * @returns A promise that resolves when the item is renamed.
     * @throws Error if the rename operation fails.
     */
    async rename(targetPath: string, newName: string): Promise<void> {
        const url = `${this.api}${this.normalizePath(targetPath)}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: this.getHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ new_name: newName }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Rename failed: ${response.status} ${response.statusText} - ${errorText}`);
        }
    }

    /**
     * Lists the contents of a directory in the storage.
     * @param targetPath The path of the directory to list.
     * @returns A promise that resolves to an array of file and directory information.
     * @throws Error if the list operation fails.
     */
    async list(targetPath: string): Promise<FileInfo[]> {
        const url = `${this.api}${this.normalizePath(targetPath)}`;
        const response = await fetch(url, {
            method: "GET",
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`List failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const json = await response.json() as { data: FileInfo[] };
        return json.data;
    }

    /**
     * Downloads a file from the storage as a Blob.
     * @param targetPath The path of the file in storage.
     * @returns A promise that resolves to the file data as a Blob.
     * @throws Error if the download operation fails.
     */
    async download(targetPath: string): Promise<Blob> {
        const url = `${this.api}${this.normalizePath(targetPath)}`;
        const response = await fetch(url, {
            method: "GET",
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Download failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return response.blob();
    }
}
