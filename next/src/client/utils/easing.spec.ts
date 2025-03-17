import { describe, expect, it } from "vitest";
import { type EasingType, easing } from "./easing";

describe("Easing", () => {
  describe("getProgress", () => {
    it("基本動作", () => {
      const config = {
        duration: 1000,
        easing: "linear" as EasingType,
      };

      expect(easing.getProgress(0, config)).toBe(0);
      expect(easing.getProgress(500, config)).toBe(0.5);
      expect(easing.getProgress(1000, config)).toBe(1);
    });

    it("カスタム開始値と終了値", () => {
      const config = {
        duration: 1000,
        easing: "linear" as EasingType,
        startValue: 100,
        endValue: 200,
      };

      expect(easing.getProgress(0, config)).toBe(100);
      expect(easing.getProgress(500, config)).toBe(150);
      expect(easing.getProgress(1000, config)).toBe(200);
    });

    describe("ループアニメーションのテスト", () => {
      const config = {
        duration: 1000,
        easing: "linear" as EasingType,
        loop: true,
      };

      it("ループの前半周", () => {
        expect(easing.getProgress(0, config)).toBe(0);
        expect(easing.getProgress(250, config)).toBe(0.5);
        expect(easing.getProgress(500, config)).toBe(1);
      });

      it("ループの後半周", () => {
        expect(easing.getProgress(750, config)).toBe(0.5);
        expect(easing.getProgress(1000, config)).toBe(0);
      });

      it("ループし続けるか", () => {
        expect(easing.getProgress(1250, config)).toBe(0.5);
        expect(easing.getProgress(1500, config)).toBe(1);
        expect(easing.getProgress(1750, config)).toBe(0.5);
        expect(easing.getProgress(2000, config)).toBe(0);
      });
    });

    describe("境界値テスト", () => {
      const config = {
        duration: 1000,
        easing: "linear" as EasingType,
      };

      it("elapsed が負値", () => {
        expect(easing.getProgress(-500, config)).toBe(0);
      });

      it("elapsed が duration を超過", () => {
        expect(easing.getProgress(1500, config)).toBe(1);
      });
    });

    // 各イージング関数のテスト
    describe("easing functions", () => {
      const easingTypes: EasingType[] = [
        "easeInQuad",
        "easeOutQuad",
        "easeInOutQuad",
        "easeInCubic",
        "easeOutCubic",
        "easeInOutCubic",
        "easeInQuart",
        "easeOutQuart",
        "easeInOutQuart",
        "easeInQuint",
        "easeOutQuint",
        "easeInOutQuint",
        "easeInExpo",
        "easeOutExpo",
        "easeInOutExpo",
      ];

      for (const easingType of easingTypes) {
        it(`${easingType}`, () => {
          const config = {
            duration: 1000,
            easing: easingType,
          };

          // 開始点と終了点のチェック
          expect(easing.getProgress(0, config)).toBeCloseTo(0);
          expect(easing.getProgress(1000, config)).toBeCloseTo(1);

          // 中間点の値が0-1の範囲内にあることを確認
          const midPoint = easing.getProgress(500, config);
          expect(midPoint).toBeGreaterThanOrEqual(0);
          expect(midPoint).toBeLessThanOrEqual(1);
        });
      }
    });

    // エッジケースのテスト
    describe("edge cases", () => {
      it("duration が 0 の場合", () => {
        const config = {
          duration: 0,
          easing: "linear" as EasingType,
        };
        expect(easing.getProgress(0, config)).toBe(1);
      });

      it("start と end が等しい場合", () => {
        const config = {
          duration: 1000,
          easing: "linear" as EasingType,
          startValue: 100,
          endValue: 100,
        };
        expect(easing.getProgress(500, config)).toBe(100);
      });

      it("duration が短い場合", () => {
        const config = {
          duration: 0.1,
          easing: "linear" as EasingType,
        };
        expect(easing.getProgress(0.05, config)).toBe(0.5);
      });
    });

    describe("特殊なイージング関数のエッジケースのテスト", () => {
      it("easeInExpo の始点", () => {
        const config = {
          duration: 1000,
          easing: "easeInExpo" as EasingType,
        };
        expect(easing.getProgress(0, config)).toBe(0);
      });

      it("easeInExpo の終点", () => {
        const config = {
          duration: 1000,
          easing: "easeOutExpo" as EasingType,
        };
        expect(easing.getProgress(1000, config)).toBe(1);
      });

      it("easeInOutExpo の始点と終点", () => {
        const config = {
          duration: 1000,
          easing: "easeInOutExpo" as EasingType,
        };
        expect(easing.getProgress(0, config)).toBe(0);
        expect(easing.getProgress(1000, config)).toBe(1);
      });
    });
  });
});
