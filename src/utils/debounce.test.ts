import { describe, it, expect, vi, afterEach } from "vitest";
import debounce from "./debounce";

afterEach(() => {
  vi.useRealTimers();
});

describe("debounce", () => {
  it("默认 trailing：等待期内只执行一次，并使用最后一次参数", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("a");
    vi.advanceTimersByTime(50);
    debounced("b");
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("b");
  });

  it("immediate：首次立即执行，窗口内后续调用被忽略，窗口过后恢复", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100, true);

    debounced("first");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("first");

    debounced("second");
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    debounced("third");
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("third");
  });

  it("默认等待时间为 300ms", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn);

    debounced();
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
