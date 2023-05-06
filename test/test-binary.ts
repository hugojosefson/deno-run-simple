import { run, RunOptions } from "../src/run.ts";
import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
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
