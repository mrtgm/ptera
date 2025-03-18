import { describe, expect, it, vi } from "vitest";
import { getErrorMessage } from "./error";

describe("getErrorMessage", () => {
  it("文字列エラーをそのまま返す", () => {
    const errorMessage = "このエラーは文字列です";
    expect(getErrorMessage(errorMessage)).toBe(errorMessage);
  });

  it("Error オブジェクトからメッセージを抽出する", () => {
    const errorMessage = "Error オブジェクトのメッセージ";
    const error = new Error(errorMessage);
    expect(getErrorMessage(error)).toBe(errorMessage);
  });

  it("カスタムエラーオブジェクトからメッセージを抽出する", () => {
    const errorMessage = "カスタムエラーのメッセージ";
    const customError = { message: errorMessage, code: 500 };
    expect(getErrorMessage(customError)).toBe(errorMessage);
  });

  it('message プロパティが文字列でない場合は "Unknown Error" を返す', () => {
    const invalidError = { message: 123 };
    expect(getErrorMessage(invalidError)).toBe("Unknown Error");
  });

  it('null が渡された場合は "Unknown Error" を返す', () => {
    expect(getErrorMessage(null)).toBe("Unknown Error");
  });

  it('undefined が渡された場合は "Unknown Error" を返す', () => {
    expect(getErrorMessage(undefined)).toBe("Unknown Error");
  });

  it('message プロパティのないオブジェクトは "Unknown Error" を返す', () => {
    const errorWithoutMessage = { code: 404 };
    expect(getErrorMessage(errorWithoutMessage)).toBe("Unknown Error");
  });

  it("エラーメッセージを取得できない場合はコンソールにエラーを出力する", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const unknownError = { code: 500 };
    const result = getErrorMessage(unknownError);

    expect(result).toBe("Unknown Error");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Unable to get error message for error",
      unknownError,
    );
    consoleSpy.mockRestore();
  });
});
