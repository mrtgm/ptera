export const waitMs = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const debounce = (func: () => void, wait: number): (() => void) => {
  let timeout: number | null = null;
  return () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
      func();
    }, wait);
  };
};

export const updateOrAppend = <T, K extends keyof T>(
  array: T[],
  newItem: T,
  key: K,
): T[] => {
  return array.some((item) => item[key] === newItem[key])
    ? array.map((item) => (item[key] === newItem[key] ? newItem : item))
    : [...array, newItem];
};

export function mapReduce<T, R, K extends string>(
  map: { [key in K]: T },
  fn: (t: T, key: K) => R,
): { [key in K]: R } {
  const ret = {} as { [key in K]: R };
  for (const key in map) {
    ret[key] = fn(map[key], key);
  }
  return ret;
}

export function mapEach<T, K extends string>(
  map: { [key in K]: T },
  fn: (t: T, key: K) => void,
) {
  for (const key in map) {
    fn(map[key], key);
  }
}

export function findFirstObjectValue<T>(obj: Record<string, T>): T | undefined {
  for (const key in obj) {
    return obj[key];
  }
}
