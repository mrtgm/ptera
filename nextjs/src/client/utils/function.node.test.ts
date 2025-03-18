import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  debounce,
  findFirstObjectValue,
  mapEach,
  mapReduce,
  updateOrAppend,
  waitMs,
} from "./function";

describe("waitMs", () => {
  it("指定した時間だけ待機する", async () => {
    const start = Date.now();
    await waitMs(100);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(90);
  });
});

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("関数の呼び出しを遅延させる", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(99);
    expect(mockFn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("連続呼び出し時に前の呼び出しをキャンセルする", () => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe("updateOrAppend", () => {
  it("配列に存在しない項目を追加する", () => {
    const array = [
      { id: 1, name: "item1" },
      { id: 2, name: "item2" },
    ];
    const newItem = { id: 3, name: "item3" };
    const result = updateOrAppend(array, newItem, "id");
    expect(result).toHaveLength(3);
    expect(result).toContainEqual(newItem);
  });

  it("既存の項目を更新する", () => {
    const array = [
      { id: 1, name: "item1" },
      { id: 2, name: "item2" },
    ];
    const updatedItem = { id: 2, name: "updated item2" };
    const result = updateOrAppend(array, updatedItem, "id");
    expect(result).toHaveLength(2);
    expect(result).toContainEqual(updatedItem);
    expect(result.find((item) => item.id === 2)?.name).toBe("updated item2");
  });

  it("空の配列に項目を追加する", () => {
    const array: { id: number; name: string }[] = [];
    const newItem = { id: 1, name: "item1" };
    const result = updateOrAppend(array, newItem, "id");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(newItem);
  });
});

describe("mapReduce", () => {
  it("オブジェクトの各値を変換する", () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    };

    const result = mapReduce(obj, (value, key) => value * 2);
    expect(result).toEqual({
      a: 2,
      b: 4,
      c: 6,
    });
  });

  it("キーと値を組み合わせて変換する", () => {
    const obj = {
      a: 5,
      b: 10,
      c: 15,
    };

    const result = mapReduce(obj, (value, key) => `${key}:${value}`);
    expect(result).toEqual({
      a: "a:5",
      b: "b:10",
      c: "c:15",
    });
  });

  it("空のオブジェクトを処理する", () => {
    const obj = {} as { [key: string]: number };
    const result = mapReduce(obj, (value) => value * 2);
    expect(result).toEqual({});
  });
});

describe("mapEach", () => {
  it("オブジェクトの各値に対して関数を実行する", () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    };

    const mockFn = vi.fn();
    mapEach(obj, mockFn);
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(mockFn).toHaveBeenCalledWith(1, "a");
    expect(mockFn).toHaveBeenCalledWith(2, "b");
    expect(mockFn).toHaveBeenCalledWith(3, "c");
  });

  it("空のオブジェクトを処理する", () => {
    const obj = {} as { [key: string]: number };
    const mockFn = vi.fn();
    mapEach(obj, mockFn);
    expect(mockFn).not.toHaveBeenCalled();
  });
});

describe("findFirstObjectValue", () => {
  it("オブジェクトの最初の値を返す", () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
    };
    const result = findFirstObjectValue(obj);
    expect(result).toBe(1);
  });

  it("空のオブジェクトの場合はundefinedを返す", () => {
    const obj = {};
    const result = findFirstObjectValue(obj);
    expect(result).toBeUndefined();
  });
});
