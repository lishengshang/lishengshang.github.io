import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { mainStore } from "@/store";
import { ripple } from "@/utils/ripple";

// 波纹指令守卫与兜底清理回归：
// no-motion（页面动画关闭）下 animationend 不触发，历史实现会向宿主无限累积不可见节点
describe("ripple 指令", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mountAndClick = () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    ripple.mounted(el);
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: 10, clientY: 10 }));
    return el;
  };

  it("降低动态效果开启时不生成波纹", () => {
    mainStore().reduceMotion = true;
    expect(mountAndClick().querySelectorAll(".ripple-effect").length).toBe(0);
  });

  it("页面动画关闭时不生成波纹", () => {
    mainStore().animationShow = false;
    expect(mountAndClick().querySelectorAll(".ripple-effect").length).toBe(0);
  });

  it("正常点击生成波纹且兜底定时后移除（防 DOM 累积）", () => {
    vi.useFakeTimers();
    const el = mountAndClick();
    expect(el.querySelectorAll(".ripple-effect").length).toBe(1);
    vi.advanceTimersByTime(800);
    expect(el.querySelectorAll(".ripple-effect").length).toBe(0);
  });
});
