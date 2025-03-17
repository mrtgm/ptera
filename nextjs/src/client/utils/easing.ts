import { minMax } from "./math";

type EasingFunction = (x: number) => number;

export type EasingType =
  | "linear"
  | "easeInQuad"
  | "easeOutQuad"
  | "easeInOutQuad"
  | "easeInCubic"
  | "easeOutCubic"
  | "easeInOutCubic"
  | "easeInQuart"
  | "easeOutQuart"
  | "easeInOutQuart"
  | "easeInQuint"
  | "easeOutQuint"
  | "easeInOutQuint"
  | "easeInExpo"
  | "easeOutExpo"
  | "easeInOutExpo";

type EasingFunctionMap = {
  [key in EasingType]: EasingFunction;
};

type AnimationConfig = {
  duration: number;
  easing: EasingType;
  loop?: boolean;
  startValue?: number;
  endValue?: number;
};

class Easing {
  private static easingFunctions: EasingFunctionMap = {
    linear: (x) => x,
    easeInQuad: (x) => x ** 2,
    easeOutQuad: (x) => 1 - (1 - x) ** 2,
    easeInOutQuad: (x) => (x < 0.5 ? 2 * x ** 2 : 1 - (-2 * x + 2) ** 2 / 2),
    easeInCubic: (x) => x ** 3,
    easeOutCubic: (x) => 1 - (1 - x) ** 3,
    easeInOutCubic: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
    easeInQuart: (x) => x ** 4,
    easeOutQuart: (x) => 1 - (1 - x) ** 4,
    easeInOutQuart: (x) => (x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2),
    easeInQuint: (x) => x ** 5,
    easeOutQuint: (x) => 1 - (1 - x) ** 5,
    easeInOutQuint: (x) => (x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2),
    easeInExpo: (x) => (x === 0 ? 0 : 2 ** (10 * x - 10)),
    easeOutExpo: (x) => (x === 1 ? 1 : 1 - 2 ** (-10 * x)),
    easeInOutExpo: (x) => {
      if (x === 0 || x === 1) return x;
      if (x < 0.5) return 2 ** (20 * x - 10) / 2;
      return (2 - 2 ** (-20 * x + 10)) / 2;
    },
  };

  public getProgress(elapsed: number, config: AnimationConfig) {
    const {
      duration,
      easing,
      startValue = 0,
      endValue = 1,
      loop = false,
    } = config;

    const easingFunction = Easing.easingFunctions[easing];

    if (duration === 0) {
      return endValue;
    }

    if (loop) {
      const p = elapsed % duration;
      const isSecondHalf = p > duration / 2;
      const x = isSecondHalf
        ? 1 - minMax((p - duration / 2) / (duration / 2), 0, 1)
        : minMax(p / (duration / 2), 0, 1);
      const progress = startValue + (endValue - startValue) * easingFunction(x);
      return progress;
    }

    const x = minMax(elapsed / duration, 0, 1);
    const progress = startValue + (endValue - startValue) * easingFunction(x);
    return progress;
  }
}

export const easing = new Easing();
