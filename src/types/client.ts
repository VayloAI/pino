import {
  pino,
  Logger as PinoLogger,
  TransportMultiOptions,
  TransportTargetOptions,
} from "pino";

import { Level, LokiConfig } from "../schema";

export type PinoClientOptions = {
  level?: Level;
  logToFile?: boolean;
  logPath?: string;
  logName?: string;
  loki?: LokiConfig;
};

export type PinoOpts = Parameters<typeof pino>[0] & {
  transport: TransportMultiOptions & { targets: TransportTargetOptions[] };
};

export type Logger = PinoLogger;
