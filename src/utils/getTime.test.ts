import { describe, it, expect, vi, afterEach } from "vitest";
import { getCurrentTime, getTimeCapsule, siteDateStatistics } from "./getTime";

afterEach(() => {
  vi.useRealTimers();
});

describe("getCurrentTime", () => {
  it("返回当前时间的格式化结果（含补零与星期）", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 9, 15, 4, 5));

    const time = getCurrentTime();
    expect(time.year).toBe(2026);
    expect(time.month).toBe("09");
    expect(time.day).toBe("09");
    expect(time.hour).toBe(15);
    expect(time.minute).toBe("04");
    expect(time.second).toBe("05");
    expect(time.weekday).toBe("星期三");
  });

  it("单位数时间补零", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 3, 5, 7));

    const time = getCurrentTime();
    expect(time.month).toBe("01");
    expect(time.day).toBe("01");
    expect(time.hour).toBe("03");
    expect(time.minute).toBe("05");
    expect(time.second).toBe("07");
  });
});

describe("getTimeCapsule", () => {
  it("包含四个时间单位且名称正确", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 9, 12, 0, 0));

    const capsule = getTimeCapsule();
    expect(capsule.day.name).toBe("今日");
    expect(capsule.week.name).toBe("本周");
    expect(capsule.month.name).toBe("本月");
    expect(capsule.year.name).toBe("本年");
  });

  it("各时间单位满足 passed + remaining === total", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 9, 12, 0, 0));

    const capsule = getTimeCapsule();
    for (const unit of [capsule.day, capsule.week, capsule.month, capsule.year]) {
      expect(unit.passed + unit.remaining).toBe(unit.total);
      expect(Number(unit.percentage)).toBeGreaterThanOrEqual(0);
      expect(Number(unit.percentage)).toBeLessThanOrEqual(100);
    }
  });
});

describe("siteDateStatistics", () => {
  it("整年整日计算", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 9));

    expect(siteDateStatistics(new Date(2025, 8, 9))).toBe("本站已经苟活了 1 年 0 月 0 天");
  });

  it("天数为负时向月份借位", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 10));

    // 2024-01-31 → 2026-01-31（2 年）→ 2026-02-28（1 月）→ 2026-03-10（10 天）
    expect(siteDateStatistics(new Date(2024, 0, 31))).toBe("本站已经苟活了 2 年 1 月 10 天");
  });
});
