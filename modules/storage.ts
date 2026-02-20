import type { StorageOptions, FileInfo } from "../types";

export type StorageSource = string | Buffer | Blob | File;

export class Storage {
    public readonly api: string;
    public readonly id: string;
    public readonly token: string;

    constructor(options: StorageOptions) {
        if (!options.api) throw new Error("API URL is required");
        if (!options.id) throw new Error("Storage ID is required");
        if (!options.token) throw new Error("Token is required");

        this.api = `${options.api.replace(/\/$/, "")}/storage/${options.id}`;
        this.id = options.id;
        this.token = options.token;
    }

    private getHeaders(additional: Record<string, string> = {}): Record<string, string> {
        return {
            Token: this.token,
            ...additional,
        };
    }

    private normalizePath(p: string): string {
        return p.startsWith("/") ? p : `/${p}`;
    }

    /**
     * Resolves various file sources into a Blob or File for FormData
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
     * Upload a local file to the storage
     * @param targetDirectory The directory on the storage to upload to (e.g. "/")
     * @param source The absolute path to the local file, or a File/Blob/Buffer object
     * @param fileName Optional file name to use when providing a Blob/Buffer
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
     * Delete a file or directory
     * @param targetPath The path on the storage to delete
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
     * Create a new folder
     * @param parentPath The parent directory where the folder will be created
     * @param folderName The name of the new folder
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
     * Create an empty file
     * @param parentPath The parent directory
     * @param fileName The name of the new file
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
     * Rename a file or directory
     * @param targetPath The current path of the file/folder
     * @param newName The new name (just the name, not full path)
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
     * List directory contents
     * @param targetPath The directory path to list
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
     * Download a file
     * @param targetPath The path to the file on storage
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
