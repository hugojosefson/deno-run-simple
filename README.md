# run_simple

Simple run function to execute shell commands in Deno.

## Usage

```typescript
// example.ts

import { run } from "https://deno.land/x/run_simple/mod.ts";

const dir: string = await run("ls -l");
console.log(dir);

const uid = 1000;
const idLine: string = await run(["id", uid]);
console.log(idLine);

const remoteHost = "10.20.30.40";
const remoteCommand = "ps -ef --forest";
const remoteProcessTree: string = await run(["ssh", remoteHost, remoteCommand]);

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
