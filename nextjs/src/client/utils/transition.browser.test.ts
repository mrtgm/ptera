import { easing } from "@/client/utils/easing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventManager } from "../features/player";
import {
  Transition,
  numberInterpolator,
  parseTransform,
  transformInterpolator,
} from "./transition";

describe("parseTransform", () => {
  it("正しい transform 文字列を解析する", () => {
    const result = parseTransform("translateX(10px)");
    expect(result).toEqual({
      funcName: "translateX",
      value: 10,
      unit: "px",
    });
  });

  it("マイナス値を含む transform 文字列を解析する", () => {
    const result = parseTransform("translateY(-20.5px)");
    expect(result).toEqual({
      funcName: "translateY",
      value: -20.5,
      unit: "px",
    });
  });

  it("単位なしの transform 文字列を解析する", () => {
    const result = parseTransform("rotate(45)");
    expect(result).toEqual({
      funcName: "rotate",
      value: 45,
      unit: "",
    });
  });

  it("パーセント単位の transform 文字列を解析する", () => {
    const result = parseTransform("scale(50%)");
    expect(result).toEqual({
      funcName: "scale",
      value: 50,
      unit: "%",
    });
  });

  it("無効な transform 文字列の場合は null を返す", () => {
    const result = parseTransform("invalid");
    expect(result).toBeNull();
  });

  it("数値を含まない transform 文字列の場合は null を返す", () => {
    const result = parseTransform("translateX(px)");
    expect(result).toBeNull();
  });
});

describe("numberInterpolator", () => {
  it("数値を正しく補間する", () => {
    expect(numberInterpolator(0, 10, 0)).toBe(0);
    expect(numberInterpolator(0, 10, 0.5)).toBe(5);
    expect(numberInterpolator(0, 10, 1)).toBe(10);
  });

  it("負の数値を正しく補間する", () => {
    expect(numberInterpolator(-10, 10, 0)).toBe(-10);
    expect(numberInterpolator(-10, 10, 0.5)).toBe(0);
    expect(numberInterpolator(-10, 10, 1)).toBe(10);
  });

  it("小数点の数値を正しく補間する", () => {
    expect(numberInterpolator(0.5, 1.5, 0)).toBe(0.5);
    expect(numberInterpolator(0.5, 1.5, 0.5)).toBe(1);
    expect(numberInterpolator(0.5, 1.5, 1)).toBe(1.5);
  });
});

describe("transformInterpolator", () => {
  it("translateX を正しく補間する", () => {
    const from = "translateX(0px)";
    const to = "translateX(100px)";

    expect(transformInterpolator(from, to, 0)).toBe("translateX(0px)");
    expect(transformInterpolator(from, to, 0.5)).toBe("translateX(50px)");
    expect(transformInterpolator(from, to, 1)).toBe("translateX(100px)");
  });

  it("異なる関数名の場合は from 値を返す", () => {
    const from = "translateX(0px)";
    const to = "translateY(100px)";

    expect(transformInterpolator(from, to, 0.5)).toBe(from);
  });

  it("無効な transform 文字列の場合は from 値を返す", () => {
    const from = "translateX(0px)";
    const to = "invalid";

    expect(transformInterpolator(from, to, 0.5)).toBe(from);
  });

  it("単位が異なる場合は to の単位を使用する", () => {
    const from = "translateX(0px)";
    const to = "translateX(100%)";

    expect(transformInterpolator(from, to, 0.5)).toBe("translateX(50%)");
  });
});

describe("Transition", () => {
  let mockEventManager: EventManager;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockEventManager = new EventManager();
    mockElement = document.createElement("div");

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      return setTimeout(
        () => callback(performance.now()),
        0,
      ) as unknown as number;
    });

    vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
      clearTimeout(id);
    });

    vi.spyOn(easing, "getProgress").mockImplementation((elapsed, config) => {
      const { duration = 0 } = config;
      return duration > 0 ? Math.min(elapsed / duration, 1) : 1;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("トランジションを正しく開始して完了する", async () => {
    const onCompleteMock = vi.fn();
    const eventId = 1;

    const transition = new Transition(mockEventManager, {
      targets: [
        {
          element: mockElement,
          properties: [
            {
              property: "opacity",
              keyframes: [
                { offset: 0, value: 0 },
                { offset: 1, value: 1 },
              ],
            },
          ],
        },
      ],
      duration: 100,
      eventId,
      onComplete: onCompleteMock,
    });

    await transition.start();

    expect(mockElement.style.opacity).toBe("1");
    expect(onCompleteMock).toHaveBeenCalledWith([mockElement]);
  });

  it("イベントがキャンセルされた場合はトランジションをスキップする", async () => {
    const onCompleteMock = vi.fn();
    const eventId = 2;

    // イベントをキャンセル
    mockEventManager.addCancelRequest(eventId);

    const transition = new Transition(mockEventManager, {
      targets: [
        {
          element: mockElement,
          properties: [
            {
              property: "opacity",
              keyframes: [
                { offset: 0, value: 0 },
                { offset: 1, value: 1 },
              ],
            },
          ],
        },
      ],
      duration: 100,
      eventId,
      onComplete: onCompleteMock,
    });

    await transition.start();

    // 完了コールバックが呼ばれ、最終値が設定されることを確認
    expect(mockElement.style.opacity).toBe("1");
    expect(onCompleteMock).toHaveBeenCalledWith([mockElement]);
  });

  it("複数のプロパティを持つトランジションを正しく処理する", async () => {
    const eventId = 3;

    const transition = new Transition(mockEventManager, {
      targets: [
        {
          element: mockElement,
          properties: [
            {
              property: "opacity",
              keyframes: [
                { offset: 0, value: 0 },
                { offset: 1, value: 1 },
              ],
            },
            {
              property: "transform",
              keyframes: [
                { offset: 0, value: "translateX(0px)" },
                { offset: 1, value: "translateX(100px)" },
              ],
            },
          ],
        },
      ],
      duration: 100,
      eventId,
    });

    await transition.start();

    expect(mockElement.style.opacity).toBe("1");
    expect(mockElement.style.transform).toBe("translateX(100px)");
  });

  it("単位を持つプロパティを正しく処理する", async () => {
    const eventId = 4;

    const transition = new Transition(mockEventManager, {
      targets: [
        {
          element: mockElement,
          properties: [
            {
              property: "transform",
              keyframes: [
                { offset: 0, value: 0 },
                { offset: 1, value: 100 },
              ],
              unit: "px",
            },
          ],
        },
      ],
      duration: 100,
      eventId,
    });

    await transition.start();

    expect(mockElement.style.transform).toBe("100px");
  });
});
