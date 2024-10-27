#!/usr/bin/env -S deno run --allow-run=ls,id,ssh
// example-usage.ts
import { run } from "../mod.ts";

/**
 * This example shows some ways to use the run function.
 * @module
 */

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
