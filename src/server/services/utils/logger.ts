// logger.ts
import fs from "fs";
import path from "path";
import { AccessBar, statusBar } from "@/server/models/client/bars";

type LogData = {
  access: AccessBar[];
  status: statusBar;
};

export class FSLogger {
  private logDir: string;

  constructor(logDir = "logs") {
    this.logDir = logDir;
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getLogFilePath(): string {
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    return path.join(this.logDir, `${date}.log`);
  }

  public log(data: LogData) {
    const filePath = this.getLogFilePath();
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, ...data };

    fs.appendFileSync(filePath, JSON.stringify(logEntry) + "\n", "utf8");
  }
}
