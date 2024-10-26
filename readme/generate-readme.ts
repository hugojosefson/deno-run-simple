#!/usr/bin/env -S deno run --allow-read=.
import { dirname, relative, resolve } from "@std/path";

/**
 * This program generates the README.md for the root directory.
 *
 * It reads from the file referred to by this program's first argument, and writes to stdout.
 *
 * Based on what it sees when it reads from the file, it may also read files from
 * the filesystem.
 *
 * It reads text, and writes text. The only syntax it understands is the
 * following directives:
 * - Any line that includes the text `@@include(filename)` will be replaced
 *   with the contents of the file, relative to the currently parsed file. The
 *   whole line will be replaced.
 * - Any shebang line at the start of any input file, will be removed.
 * - For any occurrence of /\sfrom\s+"(\..*)"/ the path will be extracted and resolved from the currently parsed file, and then resolved to a relative path from the root of the git repo, then the whole `from` clause will be replaced with `from "@${username}/${projectName}/${relativePathFromGitRoot}"`.
 * - The resulting text will be written to stdout.
 */
async function main() {
  const inputFilePath =
    (new URL(Deno.args[0], `file://${Deno.cwd()}/`)).pathname;
  const inputText = await Deno.readTextFile(inputFilePath);
  const outputText = await processText(inputText, inputFilePath);
  console.log(outputText);
}

async function processText(
  inputText: string,
  inputFilePath: string,
): Promise<string> {
  const lines = inputText.split("\n");
  // skip any first line with shebang
  if (lines[0]?.startsWith("#!")) {
    lines.shift();
  }
  const forInclude = processLineForInclude(inputFilePath);
  const forImport = processLineForImport(inputFilePath);
  return (await Promise.all(lines.map(
    async function (line: string) {
      const lines1: string[] = (await forInclude(line)).split("\n");
      const lines2: string[] = lines1.map(forImport);
      return lines2.join("\n");
    },
  ))).join("\n");
}

function processLineForInclude(
  inputFilePath: string,
): (line: string) => Promise<string> {
  return async (line: string): Promise<string> => {
    const match = line.match(/@@include\((.*)\)/);
    if (match) {
      const matchedPath = match[1];
      const includeFilePath = resolve(dirname(inputFilePath), matchedPath);
      const resolvedIncludeFilePath = await Deno.realPath(includeFilePath);
      return await processText(
        await Deno.readTextFile(resolvedIncludeFilePath),
        resolvedIncludeFilePath,
      );
    }
    return line;
  };
}

function processLineForImport(
  inputFilePath: string,
): (line: string) => string {
  return (line: string): string => {
    const match = line.match(/\sfrom\s+"(\..*)"/);
    if (match) {
      const importPath = match[1];
      const step1: string =
        (new URL(importPath, `file://${inputFilePath}`)).pathname;
      const gitRoot = (new URL("../", import.meta.url)).pathname;
      const step2: string = relative(gitRoot, step1);
      if (step2 === "mod.ts") {
        return line.replace(
          /\sfrom\s+"(\..*)"/,
          ` from "@hugojosefson/run-simple"`,
        );
      }
      return line.replace(
        /\sfrom\s+"(\..*)"/,
        ` from "@hugojosefson/run-simple/${step2}"`,
      );
    }
    return line;
  };
}

if (import.meta.main) {
  await main();
}
