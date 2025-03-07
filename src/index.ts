import path from "node:path";
import fs from "node:fs/promises";
import fsSync from "node:fs";

import { pino } from "pino";
import { Value } from "@sinclair/typebox/value";

import { Level, LokiConfig } from "./schema";
import { PinoClientOptions, PinoOpts } from "./types/client";

export class PinoClient {
  level: Level;
  logToFile: boolean;
  logPath: string;
  logName?: string;
  loki?: LokiConfig;

  constructor({
    logPath = "",
    level,
    logToFile,
    logName,
    loki,
  }: PinoClientOptions) {
    this.level = Value.Check(Level, level) ? level : "info";
    this.logToFile = logToFile === true;
    this.logPath = logPath;
    this.logName = logName;
    this.loki = loki;
  }

  async createLogDir() {
    if (!this.logToFile) {
      return false;
    }

    if (fsSync.existsSync(this.logPath)) {
      return true;
    }

    await fs.mkdir(this.logPath, { recursive: true });
    return true;
  }

  init() {
    const logName = this.logName ?? new Date().toISOString().split("T")[0];
    const opts: PinoOpts = {
      level: this.level,
      redact: {
        // these just cause clutter
        paths: ["pid", "hostname"],
        remove: true,
      },
      transport: {
        targets: [
          {
            level: this.level,
            target: "pino-pretty",
            options: {
              colorized: true,
            },
          },
        ],
      },
    };

    if (this.logToFile) {
      opts.transport.targets.push({
        level: this.level,
        target: "pino/file",
        options: {
          destination: path.join(this.logPath, `${logName}.log`),
        },
      });
    }

    if (this.loki?.host) {
      opts.transport.targets.push({
        level: this.level,
        target: "pino-loki",
        options: {
          batching: true,
          interval: 5,
          labels: { application: this.loki.label },
          host: this.loki.host,
          basicAuth:
            this.loki.user && this.loki.password
              ? {
                  username: this.loki.user,
                  password: this.loki.password,
                }
              : undefined,
        },
      });
    }

    return pino(opts);
  }
}
