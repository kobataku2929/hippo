interface Reusable<T> {
  value: T;
}
export function reusable<T>(init: () => T): Reusable<T> {
  const key = "value";
  return {
    get [key]() {
      const value = init();
      Object.defineProperty(this, key, { value });
      return value;
    },
  };
}
