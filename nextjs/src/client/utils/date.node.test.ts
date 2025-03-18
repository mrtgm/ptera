import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { formatDate } from "./date";

describe("formatDate", () => {
  // 現在のロケールと時間帯を保存
  const originalDateTimeFormat = Intl.DateTimeFormat;

  beforeAll(() => {
    // 日本のロケールとタイムゾーンを強制的に設定
    vi.spyOn(Intl, "DateTimeFormat").mockImplementation((locales, options) => {
      return new originalDateTimeFormat(["ja-JP"], {
        ...options,
        timeZone: "Asia/Tokyo",
      });
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("数値タイムスタンプから日本語形式の日付を生成する", () => {
    // 2023年1月15日 (JST)
    const timestamp = 1673740800000;
    // 日本語形式: "2023年1月15日"
    const result = formatDate(timestamp);
    expect(result).toMatch(/2023年1月15日|2023年1月15日/);
  });

  it("ISO文字列から日本語形式の日付を生成する", () => {
    // 2023年12月31日
    const isoString = "2023-12-31T00:00:00Z";
    const result = formatDate(isoString);
    expect(result).toMatch(/2023年12月31日|2023年12月31日/);
  });

  it("不正な入力の場合も何らかの文字列を返す", () => {
    // 不正な入力でもエラーが発生しないことを確認
    const result = formatDate("invalid-date");
    // 結果は環境に依存するため、文字列が返ることだけを検証
    expect(typeof result).toBe("string");
  });
});
