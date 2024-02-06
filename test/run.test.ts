import { jsonArrayRun, jsonlRun, run } from "../mod.ts";
import { assertEquals } from "https://deno.land/std@0.214.0/assert/assert_equals.ts";
import { CommandFailureError } from "../src/run.ts";
import { testStdinAmount, testStdoutAmount } from "./test-data-amount.ts";
import { testStdinBinary } from "./test-binary.ts";

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

Deno.test("jsonlRun: echo hello", async () => {
  const result = await jsonlRun("echo hello");
  assertEquals(result, ["hello"]);
});

/** example from https://jsonlines.org/examples/ */
const jsonLinesString =
  `{"name": "Gilbert", "wins": [["straight", "7♣"], ["one pair", "10♥"]]}
{"name": "Alexa", "wins": [["two pair", "4♠"], ["two pair", "9♠"]]}
{"name": "May", "wins": []}
{"name": "Deloise", "wins": [["three of a kind", "5♣"]]}`;
const jsonLines = [
  { name: "Gilbert", wins: [["straight", "7♣"], ["one pair", "10♥"]] },
  { name: "Alexa", wins: [["two pair", "4♠"], ["two pair", "9♠"]] },
  { name: "May", wins: [] },
  { name: "Deloise", wins: [["three of a kind", "5♣"]] },
];

Deno.test("jsonlRun: cat < jsonLinesString", async () => {
  const result = await jsonlRun("cat", { stdin: jsonLinesString });
  assertEquals(result, jsonLines);
});

testStdoutAmount(1);
testStdoutAmount(128);
testStdoutAmount(256);
testStdoutAmount(384, true);
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

testStdinBinary(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
testStdinBinary(
  new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
);
testStdinBinary(
  new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
);
testStdinBinary(
  new Uint8Array([
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
  ]),
);

Deno.test("jsonArrayRun: echo hello", async () => {
  const result = await jsonArrayRun("echo hello");
  assertEquals(result, ["hello"]);
});

Deno.test("jsonArrayRun: cat < jsonLinesString", async () => {
  const result = await jsonArrayRun("cat", { stdin: jsonLinesString });
  assertEquals(result, jsonLines);
});

const jsonArrayOfObjectsOnSingleLine = JSON.stringify(jsonLines);
Deno.test("jsonArrayRun: cat < jsonArrayOfObjectsOnSingleLine", async () => {
  const result = await jsonArrayRun("cat", {
    stdin: jsonArrayOfObjectsOnSingleLine,
  });
  assertEquals(result, jsonLines);
});

const jsonArrayOfObjectsPrettyPrinted = JSON.stringify(jsonLines, null, 2);
Deno.test("jsonArrayRun: cat < jsonArrayOfObjectsPrettyPrinted", async () => {
  const result = await jsonArrayRun("cat", {
    stdin: jsonArrayOfObjectsPrettyPrinted,
  });
  assertEquals(result, jsonLines);
});

const jsonArrayOfArrays = jsonLines.map((line) => [line.name, line.wins]);

const jsonArrayOfArraysOnSingleLine = JSON.stringify(jsonArrayOfArrays);
Deno.test("jsonArrayRun: cat < jsonArrayOfArraysOnSingleLine", async () => {
  const result = await jsonArrayRun("cat", {
    stdin: jsonArrayOfArraysOnSingleLine,
  });
  assertEquals(result, jsonArrayOfArrays);
});

const jsonArrayOfArraysPrettyPrinted = JSON.stringify(
  jsonArrayOfArrays,
  null,
  2,
);
Deno.test("jsonArrayRun: cat < jsonArrayOfArraysPrettyPrinted", async () => {
  const result = await jsonArrayRun("cat", {
    stdin: jsonArrayOfArraysPrettyPrinted,
  });
  assertEquals(result, jsonArrayOfArrays);
});
