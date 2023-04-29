import { run } from "../mod.ts";
import { assertEquals } from "https://deno.land/std@0.185.0/testing/asserts.ts";

Deno.test("run: echo hello", async () => {
  const result = await run("echo hello");
  assertEquals(result, "hello");
});

Deno.test("run: false -> rejects", async () => {
  let didReject: boolean | undefined;
  try {
    await run("false");
    didReject = false;
  } catch (_expected) {
    didReject = true;
  }
  assertEquals(didReject, true);
});

Deno.test("run: false -> rejects with an Error", async () => {
  let didRejectWithError: boolean | undefined;
  try {
    await run("false");
    didRejectWithError = false;
  } catch (e) {
    didRejectWithError = e instanceof Error;
  }
  assertEquals(didRejectWithError, true);
});
