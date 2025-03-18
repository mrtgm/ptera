import { describe, expect, it } from "vitest";
import { getInitials } from "./string";

describe("getInitials", () => {
  it("日本語の名前からイニシャルを抽出する", () => {
    expect(getInitials("山田 太郎")).toBe("山太");
    expect(getInitials("佐藤 花子")).toBe("佐花");
  });

  it("フルネームから正しいイニシャルを抽出する", () => {
    expect(getInitials("John Doe")).toBe("JD");
    expect(getInitials("jane smith")).toBe("JS");
  });

  it("複数のスペースを含む名前から正しいイニシャルを抽出する", () => {
    expect(getInitials("John Michael Doe")).toBe("JMD");
    expect(getInitials("Alice Bob Charlie")).toBe("ABC");
  });

  it("1語の名前から正しいイニシャルを抽出する", () => {
    expect(getInitials("John")).toBe("J");
    expect(getInitials("alice")).toBe("A");
  });

  it("空白文字のみの入力から空文字を返す", () => {
    expect(getInitials("   ")).toBe("");
  });

  it("空の文字列が渡された場合は空文字を返す", () => {
    expect(getInitials("")).toBe("");
  });

  it("未定義の場合はデフォルト値（空文字列）が使用される", () => {
    expect(getInitials()).toBe("");
  });
});
