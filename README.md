# @hugojosefson/run-simple

Simple `run` function to execute shell commands in Deno.

Returns a Promise of what the command printed. Rejects with status if the
command fails.

[![JSR Version](https://jsr.io/badges/@hugojosefson/run-simple)](https://jsr.io/@hugojosefson/run-simple)
[![JSR Score](https://jsr.io/badges/@hugojosefson/run-simple/score)](https://jsr.io/@hugojosefson/run-simple)
[![CI](https://github.com/hugojosefson/deno-run-simple/actions/workflows/release.yaml/badge.svg)](https://github.com/hugojosefson/deno-run-simple/actions/workflows/release.yaml)

## Requirements

Requires [Deno](https://deno.com/) v1.46.3 or later. Version 2+ is recommended.

## API

Please see docs on
[jsr.io/@hugojosefson/run-simple](https://jsr.io/@hugojosefson/run-simple).

## Installation

```sh
# add as dependency to your project
deno add jsr:@hugojosefson/run-simple
```

## Example usage

```typescript
// example-usage.ts

import { run } from "@hugojosefson/run-simple";

// Simple command
const dir: string = await run("ls -l");
console.log(dir);

// Command with variable argument
const uid = 1000;
const idLine: string = await run(["id", uid]);
console.log(idLine);

// An argument contains spaces
const remoteHost = "10.20.30.40";
const remoteCommand = "ps -ef --forest";
const remoteProcessTree: string = await run(["ssh", remoteHost, remoteCommand]);
console.log(remoteProcessTree);

// Supply STDIN to the command
const contents = `# Remote file

This will be the contents of the remote file.
`;
await run(
  ["ssh", remoteHost, "bash", "-c", "cat > remote_file.md"],
  { stdin: contents },
);
```

You may run the above example with:

```sh
deno run --allow-run ./example-usage.ts
```

Or directly from here:

```sh
deno run --allow-run --reload jsr:@hugojosefson/run-simple/example-usage
```
