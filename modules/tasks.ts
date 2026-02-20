import type { Cludz } from "../index";
import type { ApiResponse, TaskState } from "../types";

export class Tasks {
    constructor(private sdk: Cludz) {}

    /**
     * Get the current state of a task
     */
    public get(id: string): Promise<ApiResponse<TaskState>> {
        return this.sdk._request(`/v1/tasks/${id}`) as Promise<ApiResponse<TaskState>>;
    }

    /**
     * Poll a task until it's completed or failed
     * @param id The task ID
     * @param interval Polling interval in ms (default: 1000)
     * @param timeout Maximum timeout in ms (default: 60000)
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
