import path from "node:path";

import { PinoClient } from "../src";

const logger = new PinoClient({
  logPath: path.join(__dirname, "logs"),
  level: "trace",
  logName: "test",
  logToFile: true,
});

await logger.createLogDir();
const log = logger.init();

log.info("Test info message");
log.debug("Test debug message");
log.warn("Test warn message");
log.error("Test error message");
log.fatal("Test fatal message");
log.trace("Test trace message");
