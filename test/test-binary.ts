import { run, type RunOptions } from "../src/run.ts";
import { assertEquals } from "@std/assert";
import { hex1byte } from "../src/fn.ts";

export function testStdinBinary(data: Uint8Array): void {
  Deno.test("run: stdin is Uint8Array", async () => {
    const options: RunOptions = { stdin: data };
    const output: string = await run("od -t x1 -A n", options);
    const actual: string = output.split(/\s+/).join(" ").trim();

    const expected: string = Array.from(data).map(hex1byte).join(" ");
    assertEquals(actual, expected);
  });
}
