import { asString, isString, j, parseJsonSafe } from "./fn.ts";
import { weakEnvGet } from "./os.ts";

/** Item in the command array. */
export type SimpleValue = string | number | boolean;

/**
 * What the promise is rejected with, if the command exits with a non-zero exit code.
 */
export interface CommandFailure {
  /** {@link Deno.ProcessStatus} from the underlying {@link Deno.Process}. */
  status: Deno.ProcessStatus;
  /** What the command printed to STDERR. */
  stderr: string;
  /** What the command printed to STDOUT (as far as it got). */
  stdout: string;
}

/**
 * Actual Error the promise is rejected with, if the command exits with a non-zero exit code.
 */
export class CommandFailureError extends Error implements CommandFailure {
  readonly cmd: string[];
  readonly status: Deno.ProcessStatus;
  readonly stderr: string;
  readonly stdout: string;

  constructor(commandFailure: CommandFailure, cmd: string[]) {
    super(
      `Command failed with exit code ${commandFailure.status.code}: ${
        j(cmd, 0)
      }`,
    );
    this.cmd = cmd;
    this.status = commandFailure.status;
    this.stderr = commandFailure.stderr;
    this.stdout = commandFailure.stdout;
  }
}

/**
 * Extra options, to modify how the command runs.
 */
export interface RunOptions {
  /** If specified, will be supplied as STDIN to the command. */
  stdin?: string;
  /** Print extra details to STDERR; default to whether env variable `"VERBOSE"` has a truthy value, and `--allow-env` is enabled. */
  verbose?: boolean;
  /** Which directory to run the command in. */
  cwd?: string;
  /** Environment variables to pass to the command. */
  env?: {
    [key: string]: string;
  };
}

const defaultRunOptions: RunOptions = {
  verbose: !!await weakEnvGet("VERBOSE"),
};

async function tryRun(
  cmd: string[],
  options: RunOptions = defaultRunOptions,
): Promise<string> {
  options = { ...defaultRunOptions, ...options };

  const pipeStdIn = isString(options.stdin);

  if (options.verbose) {
    console.error(`
===============================================================================
${j({ cmd, options })}
-------------------------------------------------------------------------------`);
  }
  const process = Deno.run({
    cmd,
    cwd: options.cwd,
    env: options.env,
    stdin: pipeStdIn ? "piped" : "null",
    stdout: "piped",
    stderr: "piped",
  });

  if (pipeStdIn) {
    const stdinBuf = new TextEncoder().encode(options.stdin);
    try {
      await process.stdin?.write(stdinBuf);
    } finally {
      process.stdin?.close();
    }
  }

  const [
    status,
    stdout,
    stderr,
  ] = await Promise.all([
    process.status(),
    process.output(),
    process.stderrOutput(),
  ]);
  process.close();

  if (status.success) {
    const stdoutString = asString(stdout);
    if (options.verbose) {
      console.error(stdoutString);
    }
    return stdoutString;
  }
  const reason: CommandFailureError = new CommandFailureError({
    status,
    stderr: asString(stderr),
    stdout: asString(stdout),
  }, cmd);
  return Promise.reject(reason);
}

/**
 * Runs command, returning a Promise for what the command prints to STDOUT. If the command exits with non-zero exit code, the promise rejects with a {@link CommandFailure}.
 * @param command The command to run, as an array of strings, or as a single string. You do not need to quote arguments that contain spaces, when supplying the command as an array. If using the single string format, be careful with spaces.
 * @param options Options for the execution.
 */
export async function run(
  command: string | SimpleValue[],
  options: RunOptions = defaultRunOptions,
): Promise<string> {
  const cmd: string[] = isString(command)
    ? command.split(" ")
    : command.map((segment) => `${segment}`);
  try {
    return await tryRun(cmd, options);
  } catch (error) {
    if (options.verbose) {
      console.error(j({ cmd, error }));
    }
    throw error;
  }
}

/**
 * Runs a command, just like {@link run}, but parses the response as JSON if possible. Otherwise, returns it as-is.
 * @param command The command to run, as an array of strings, or as a single string. You do not need to quote arguments that contain spaces, when supplying the command as an array. If using the single string format, be careful with spaces.
 * @param options {@link RunOptions} for the execution.
 */
export async function jsonRun<T>(
  command: string | SimpleValue[],
  options: RunOptions = defaultRunOptions,
): Promise<T> {
  return parseJsonSafe(await run(command, options)) as T;
}
