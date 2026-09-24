export function isObj(value: unknown): value is Object {
  return typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value);
}

export function hasKeys<T extends object>(value: unknown, keys: (keyof T)[]): value is T {
  return isObj(value) &&
    keys.every((key: keyof T): boolean => key in value);
}

export function isIndexSignature(value: unknown): value is Record<string, string> {
  return isObj(value) &&
    Object.values(value)
      .every((value: unknown): boolean => typeof value === 'string')
}

// FIXME DONE
