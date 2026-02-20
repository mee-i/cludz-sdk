import type { Cludz } from "../index";
import type { ApiResponse, TaskState } from "../types";

/**
 * Module for managing and waiting for background tasks.
 */
export class Tasks {
    /** @internal */
    constructor(private sdk: Cludz) {}

    /**
     * Retrieves the current state of a specific background task.
     * @param id The unique task identifier.
     * @returns A promise that resolves to the task state.
     */
    public get(id: string): Promise<ApiResponse<TaskState>> {
        return this.sdk._request(`/v1/tasks/${id}`) as Promise<ApiResponse<TaskState>>;
    }

    /**
     * Polls a task until it reaches a "Completed" or "Failed" state.
     * @template T The expected type of the task result data.
     * @param id The unique task identifier.
     * @param interval Polling interval in milliseconds. Defaults to 1000.
     * @param timeout Maximum time to wait in milliseconds. Defaults to 60000.
     * @returns A promise that resolves to the final task state.
     * @throws Error if the task fails or times out.
     */
    public async waitFor<T = any>(
        id: string,
        interval: number = 1000,
        timeout: number = 60000
    ): Promise<TaskState<T>> {
        const start = Date.now();
        
        while (Date.now() - start < timeout) {
            const resp = await this.get(id);
            const task = resp.data;

            if (task.status === "Completed") {
                return task as TaskState<T>;
            }

            if (task.status === "Failed") {
                throw new Error(task.message || task.error || "Task failed");
            }

            await new Promise((resolve) => setTimeout(resolve, interval));
        }

        throw new Error(`Task timeout after ${timeout}ms`);
    }
}
