import { Type as t, type Static } from "@sinclair/typebox";

export const Level = t.Union(
  [
    t.Literal("info"),
    t.Literal("debug"),
    t.Literal("fatal"),
    t.Literal("error"),
    t.Literal("warn"),
    t.Literal("trace"),
  ],
  {
    default: "info",
  },
);
export type Level = Static<typeof Level>;

export const LokiConfig = t.Object({
  host: t.String({ default: "" }),
  user: t.String({ default: "" }),
  password: t.String({ default: "" }),
  label: t.String({
    default: "vaylo-example",
    description: "Display name in loki",
  }),
});
export type LokiConfig = Static<typeof LokiConfig>;

export const Config = t.Object({
  level: Level,
  logPath: t.String({
    description: "Path to log file",
  }),
  logToFile: t.Boolean({
    default: false,
    description: "Enable write logs to file",
  }),
  loki: LokiConfig,
});
export type Config = Static<typeof Config>;
