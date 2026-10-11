import { describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useReducedMotion } from "./useReducedMotion";
import { mainStore } from "@/store";

describe("useReducedMotion", () => {
  it("生效值为手动开关 OR 系统偏好（jsdom 无 matchMedia 时系统偏好为 false）", () => {
    setActivePinia(createPinia());
    const store = mainStore();
    const { isReduceMotion, systemReduceMotion } = useReducedMotion();

    // jsdom 无 matchMedia，系统偏好守卫为 false
    expect(systemReduceMotion.value).toBe(false);
    expect(isReduceMotion.value).toBe(false);

    store.reduceMotion = true;
    expect(isReduceMotion.value).toBe(true);
  });
});
