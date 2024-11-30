# @hugojosefson/run-simple

Simple `run` function to execute shell commands in Deno.

Returns a Promise of what the command printed. Rejects with status if the
command fails.

[![JSR Version](https://jsr.io/badges/@hugojosefson/run-simple)](https://jsr.io/@hugojosefson/run-simple)
[![JSR Score](https://jsr.io/badges/@hugojosefson/run-simple/score)](https://jsr.io/@hugojosefson/run-simple)
[![CI](https://github.com/hugojosefson/deno-run-simple/actions/workflows/release.yaml/badge.svg)](https://github.com/hugojosefson/deno-run-simple/actions/workflows/release.yaml)

## Requirements

Requires [Deno](https://deno.com/) v1.46.3 or later. Version 2+ is recommended.

## API

Please see docs on
[jsr.io/@hugojosefson/run-simple](https://jsr.io/@hugojosefson/run-simple).

## Installation

```sh
"@@include(./install.sh)";
```

## Example usage

```typescript
"@@include(./example-usage.ts)";
```

You may run the above example with:

```sh
deno run --allow-run ./example-usage.ts
```

Or directly from here:

```sh
deno run --allow-run --reload jsr:@hugojosefson/run-simple/example-usage
```
