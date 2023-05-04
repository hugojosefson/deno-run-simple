export function isString(s?: string | unknown): s is string {
  return typeof s === "string";
}

export function isUint8Array(s?: Uint8Array | unknown): s is Uint8Array {
  return s instanceof Uint8Array;
}

const decoder = new TextDecoder();

export function asString(buf: Uint8Array | null | undefined): string {
  if (!buf) {
    return "";
  }
  return decoder.decode(buf).trim();
}

export function j(obj: unknown, indentation = 2): string {
  return JSON.stringify(obj, null, indentation);
}

export function parseJsonSafe(input: string | unknown): string | unknown {
  if (isString(input)) {
    try {
      return JSON.parse(input);
    } catch (_ignore) {
      /* intentional fall-through, and return the input as-is */
    }
  }
  return input;
}

export function omit<T extends Partial<Record<K, unknown>>, K extends keyof T>(
  obj: T,
  omitKeys: K[],
): Omit<T, K> {
  const result: T = {} as T;
  const keys: K[] = Object.keys(obj) as K[];
  for (const key of keys) {
    if (!omitKeys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result as Omit<T, K>;
}
