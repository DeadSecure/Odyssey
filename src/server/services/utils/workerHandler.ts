import { Worker } from "worker_threads";

import { SitesTestResponse } from "../../../server/models/interfaces";

export function runWorker(
  workerPath: string,
  data: any
): Promise<SitesTestResponse[]> {
  return new Promise((resolve) => {
    const worker = new Worker(workerPath, { workerData: data });
    worker.on("message", (res) => resolve(res));
    worker.on("error", () => resolve([])); // ignore errors
    worker.on("exit", (code) => {
      if (code !== 0) console.warn(`Worker exited with code ${code}`);
    });
  });
}
