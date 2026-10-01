import { describe, expect, it } from "vitest";
import { resolveDark } from "@/utils/theme";

describe("resolveDark", () => {
  it("light 固定浅色，dark 固定暗色", () => {
    expect(resolveDark("light", true)).toBe(false);
    expect(resolveDark("dark", false)).toBe(true);
  });

  it("auto 跟随系统偏好", () => {
    expect(resolveDark("auto", true)).toBe(true);
    expect(resolveDark("auto", false)).toBe(false);
  });
});
