import { describe, expect, test } from "vitest";
import { type GameEvent, createEvent, sortEvent } from "./event";

const emptyResource = {
  character: {},
  cgImage: {},
  backgroundImage: {},
  soundEffect: {},
  bgm: {},
};

describe("sortEvent", () => {
  test("数字の並び替えが正しく動作すること", () => {
    const event1 = createEvent("textRender", "1", emptyResource);
    const event2 = createEvent("textRender", "2", emptyResource);
    expect(sortEvent(event1, event2)).toBeLessThan(0);
    expect(sortEvent(event2, event1)).toBeGreaterThan(0);
  });

  test("アルファベット大文字の並び替えが正しく動作すること", () => {
    const eventA = createEvent("textRender", "A", emptyResource);
    const eventB = createEvent("textRender", "B", emptyResource);
    expect(sortEvent(eventA, eventB)).toBeLessThan(0);
    expect(sortEvent(eventB, eventA)).toBeGreaterThan(0);
  });

  test("アルファベット小文字の並び替えが正しく動作すること", () => {
    const eventa = createEvent("textRender", "a", emptyResource);
    const eventb = createEvent("textRender", "b", emptyResource);
    expect(sortEvent(eventa, eventb)).toBeLessThan(0);
    expect(sortEvent(eventb, eventa)).toBeGreaterThan(0);
  });

  test("数字がアルファベット大文字より前に来ること", () => {
    const event1 = createEvent("textRender", "1", emptyResource);
    const eventA = createEvent("textRender", "A", emptyResource);
    expect(sortEvent(event1, eventA)).toBeLessThan(0);
    expect(sortEvent(eventA, event1)).toBeGreaterThan(0);
  });

  test("アルファベット大文字が小文字より前に来ること", () => {
    const eventA = createEvent("textRender", "A", emptyResource);
    const eventa = createEvent("textRender", "a", emptyResource);
    expect(sortEvent(eventA, eventa)).toBeLessThan(0);
    expect(sortEvent(eventa, eventA)).toBeGreaterThan(0);
  });

  test("同じ文字で始まる場合、短い方が先に来ること", () => {
    const eventA = createEvent("textRender", "A", emptyResource);
    const eventAA = createEvent("textRender", "AA", emptyResource);
    expect(sortEvent(eventA, eventAA)).toBeLessThan(0);
    expect(sortEvent(eventAA, eventA)).toBeGreaterThan(0);
  });

  test("複合文字列の比較が正しく動作すること", () => {
    const event1A = createEvent("textRender", "1A", emptyResource);
    const event1B = createEvent("textRender", "1B", emptyResource);
    expect(sortEvent(event1A, event1B)).toBeLessThan(0);
    expect(sortEvent(event1B, event1A)).toBeGreaterThan(0);
  });

  test("最初の文字が同じ場合、2文字目で決定すること", () => {
    const eventA1 = createEvent("textRender", "A1", emptyResource);
    const eventA2 = createEvent("textRender", "A2", emptyResource);
    expect(sortEvent(eventA1, eventA2)).toBeLessThan(0);
    expect(sortEvent(eventA2, eventA1)).toBeGreaterThan(0);
  });

  // エッジケーステスト
  test("同じorderIndexを持つイベントの場合、0を返すこと", () => {
    const event1 = createEvent("textRender", "ABC", emptyResource);
    const event2 = createEvent("textRender", "ABC", emptyResource);
    expect(sortEvent(event1, event2)).toBe(0);
  });

  test('空文字列は"0"として扱われること', () => {
    const eventEmpty = createEvent("textRender", "", emptyResource);
    const event0 = createEvent("textRender", "0", emptyResource);
    const event1 = createEvent("textRender", "1", emptyResource);
    expect(sortEvent(eventEmpty, event0)).toBe(-1); // 空文字列は長さが異なるため-1になる
    expect(sortEvent(eventEmpty, event1)).toBeLessThan(0);
  });

  test("長い文字列と短い文字列の比較が正しく動作すること", () => {
    const eventShort = createEvent("textRender", "A", emptyResource);
    const eventLong = createEvent("textRender", "ABCDEF", emptyResource);
    expect(sortEvent(eventShort, eventLong)).toBeLessThan(0);
    expect(sortEvent(eventLong, eventShort)).toBeGreaterThan(0);
  });

  test("異なる長さで先頭部分が同じ文字列の比較が正しく動作すること", () => {
    const eventABC = createEvent("textRender", "ABC", emptyResource);
    const eventABCDEF = createEvent("textRender", "ABCDEF", emptyResource);
    expect(sortEvent(eventABC, eventABCDEF)).toBeLessThan(0);
    expect(sortEvent(eventABCDEF, eventABC)).toBeGreaterThan(0);
  });
});
