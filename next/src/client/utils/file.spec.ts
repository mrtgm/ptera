import { describe, expect, it } from "vitest";
import {
  formatFileSize,
  getAcceptAttributeValue,
  getFileExtension,
} from "./file";

describe("formatFileSize", () => {
  it("バイト単位で表示されるべき", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(1)).toBe("1 B");
    expect(formatFileSize(999)).toBe("999 B");
    expect(formatFileSize(1023)).toBe("1023 B");
  });

  it("キロバイト単位で表示されるべき", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(10240)).toBe("10.0 KB");
    expect(formatFileSize(1048575)).toBe("1023.9 KB");
  });

  it("メガバイト単位で表示されるべき", () => {
    expect(formatFileSize(1048576)).toBe("1.0 MB");
    expect(formatFileSize(1572864)).toBe("1.5 MB");
    expect(formatFileSize(10485760)).toBe("10.0 MB");
    expect(formatFileSize(104857600)).toBe("100.0 MB");
  });

  it("丸めが正しく行われるべき", () => {
    expect(formatFileSize(1050000)).toBe("1.0 MB");
    expect(formatFileSize(1100000)).toBe("1.0 MB");
    expect(formatFileSize(1250000)).toBe("1.2 MB");
    expect(formatFileSize(1260000)).toBe("1.2 MB");
  });
});

describe("getFileExtension", () => {
  it("通常のファイル名から拡張子を抽出する", () => {
    expect(getFileExtension("image.jpg")).toBe("jpg");
    expect(getFileExtension("document.pdf")).toBe("pdf");
    expect(getFileExtension("archive.tar.gz")).toBe("gz");
    expect(getFileExtension("video.mp4")).toBe("mp4");
  });

  it("大文字の拡張子を小文字に変換する", () => {
    expect(getFileExtension("image.JPG")).toBe("jpg");
    expect(getFileExtension("document.PDF")).toBe("pdf");
    expect(getFileExtension("archive.TAR.GZ")).toBe("gz");
  });

  it("拡張子のないファイル名は空文字を返す", () => {
    expect(getFileExtension("README")).toBe("");
    expect(getFileExtension("Makefile")).toBe("");
    expect(getFileExtension("")).toBe("");
  });

  it("ドットで始まるファイル名（隠しファイル）の処理", () => {
    expect(getFileExtension(".gitignore")).toBe("gitignore");
    expect(getFileExtension(".bashrc")).toBe("bashrc");
  });

  it("複雑なパスからの拡張子抽出", () => {
    expect(getFileExtension("/path/to/image.jpg")).toBe("jpg");
    expect(getFileExtension("C:\\Users\\name\\document.pdf")).toBe("pdf");
    expect(getFileExtension("./relative/path/archive.tar.gz")).toBe("gz");
  });
});

describe("getAcceptAttributeValue", () => {
  it('画像タイプの場合は "image/*" を返す', () => {
    expect(getAcceptAttributeValue("image")).toBe("image/*");
    expect(getAcceptAttributeValue("image", [])).toBe("image/*");
    expect(getAcceptAttributeValue("image", ["jpg", "png"])).toBe("image/*");
  });

  it('音声タイプの場合は "audio/*" を返す', () => {
    expect(getAcceptAttributeValue("audio")).toBe("audio/*");
    expect(getAcceptAttributeValue("audio", [])).toBe("audio/*");
    expect(getAcceptAttributeValue("audio", ["mp3", "wav"])).toBe("audio/*");
  });

  it("anyタイプで拡張子が指定されている場合はドット付きの拡張子リストを返す", () => {
    expect(getAcceptAttributeValue("any", ["jpg", "png"])).toBe(".jpg,.png");
    expect(getAcceptAttributeValue("any", ["pdf"])).toBe(".pdf");
    expect(getAcceptAttributeValue("any", ["doc", "docx", "pdf"])).toBe(
      ".doc,.docx,.pdf",
    );
  });

  it('anyタイプで拡張子が空の場合は "*/*" を返す', () => {
    expect(getAcceptAttributeValue("any")).toBe("*/*");
    expect(getAcceptAttributeValue("any", [])).toBe("*/*");
    expect(getAcceptAttributeValue("any", undefined)).toBe("*/*");
  });

  it("拡張子リストの順序を維持する", () => {
    expect(getAcceptAttributeValue("any", ["zip", "rar", "tar"])).toBe(
      ".zip,.rar,.tar",
    );
  });
});
