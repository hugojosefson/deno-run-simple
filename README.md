# run_simple

Simple run function to execute shell commands in Deno.

Returns a Promise of what the command printed.

The promise rejects with status if the command fails.

## API

See the [documentation, generated from the latest release](https://doc.deno.land/https://deno.land/x/run_simple/mod.ts).

## Usage

```typescript
// example.ts

import { run } from "https://deno.land/x/run_simple/mod.ts";

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

```sh
deno run --allow-run ./example.ts
```
