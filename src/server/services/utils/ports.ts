import * as net from "net";

/**
 * Finds a free TCP port by letting the OS assign one.
 */
function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref(); // Don't block the event loop
    server.on("error", reject);

    server.listen(0, () => {
      const address = server.address();
      if (typeof address === "object" && address?.port) {
        const port = address.port;
        server.close(() => resolve(port));
      } else {
        reject(new Error("Failed to get port"));
      }
    });
  });
}

/**
 * Finds a specific number of unique free ports.
 */
export async function findMultipleFreePorts(count: number): Promise<number[]> {
  const ports: Set<number> = new Set();

  while (ports.size < count) {
    try {
      const port = await findFreePort();
      ports.add(port);
    } catch (err) {
      console.error("Error finding port:", err);
    }
  }

  return Array.from(ports);
}
