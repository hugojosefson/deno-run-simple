import { run } from "../mod.ts";
import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { CommandFailureError } from "../src/run.ts";
import { testStdinAmount, testStdoutAmount } from "./test-data-amount.ts";

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

Deno.test("run: false -> rejects with a CommandFailureError", async () => {
  let didRejectWithCommandFailureError: boolean | undefined;
  try {
    await run("false");
    didRejectWithCommandFailureError = false;
  } catch (e) {
    didRejectWithCommandFailureError = e instanceof CommandFailureError;
  }
  assertEquals(didRejectWithCommandFailureError, true);
});

Deno.test("run: cat -> returns stdin", async () => {
  const result = await run("cat", { stdin: "hello" });
  assertEquals(result, "hello");
});

testStdoutAmount(1);
testStdoutAmount(128);
testStdoutAmount(256);
testStdoutAmount(384);
testStdoutAmount(448, true);
testStdoutAmount(512 - 1, true);
testStdoutAmount(512, true);
testStdoutAmount(1024, true);

testStdinAmount(1 / 1024 / 1024);
testStdinAmount(1 / 1024);
testStdinAmount(1);
testStdinAmount(2);
testStdinAmount(4);
testStdinAmount(8);
testStdinAmount(16);
testStdinAmount(32);
testStdinAmount(40, true);
testStdinAmount(48, true);
testStdinAmount(64, true);
testStdinAmount(128, true);
testStdinAmount(256, true);
testStdinAmount(512, true);
testStdinAmount(1024, true);
