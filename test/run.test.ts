import { run } from "../mod.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

Deno.test("run: echo hello", async () => {
  const result = await run("echo hello");
  assertEquals(result, "hello");
});
