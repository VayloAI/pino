# @vaylo/pino

Pino logic for Vaylo

## Install

```bash
bun install @vaylo/pino
```

## Usage

```ts
import { PinoClient } from "@vaylo/pino";

export const loggerClient = new PinoClient({
  level: "info",
});

export const log = loggerClient.init();
```
