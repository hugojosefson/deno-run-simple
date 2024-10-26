import { run } from "../src/run.ts";
import { assertEquals } from "@std/assert";
import { format } from "@std/fmt/bytes";

export function testStdoutAmount(mb: number, ignore = false) {
  const expected = mb * 1024 * 1024;

  async function fn() {
    const result = await run(
      ["sh", "-c", `dd if=/dev/zero bs=1M | base64 | head -c ${expected}`],
    );
    assertEquals(result.length, expected);
  }

  const name = `get ${format(expected, { binary: true })} of stdout`;
  Deno.test({ name, ignore, fn });
}
export function testStdinAmount(mb: number, ignore = false) {
  const expected = mb * 1024 * 1024;

  async function fn() {
    const actual = await run(
      ["wc", "-c"],
      { stdin: Array(expected).fill("a").join("") },
    );
    assertEquals(actual, `${expected}`);
  }

  const name = `supply ${format(expected, { binary: true })} of stdin`;
  Deno.test({ name, ignore, fn });
}
