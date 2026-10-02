import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, expect, it, vi } from "vitest";
import SearchOverlay from "./SearchOverlay.vue";

// v-ripple 全局指令未在测试环境注册，空实现即可
const mountOverlay = () => {
  const pinia = createPinia();
  const wrapper = mount(SearchOverlay, {
    global: {
      plugins: [pinia],
      directives: { ripple: {} },
    },
  });
  return { pinia, wrapper };
};

describe("SearchOverlay", () => {
  it("初始 active 在第一项，↑↓ 在列表范围内移动（顶部上移回绕到末项）", async () => {
    const { wrapper } = mountOverlay();
    const input = wrapper.find(".search-input");
    expect(wrapper.findAll(".result")[0].classes()).toContain("active");

    await input.trigger("keydown.down");
    expect(wrapper.findAll(".result")[1].classes()).toContain("active");

    await input.trigger("keydown.up");
    await input.trigger("keydown.up");
    const results = wrapper.findAll(".result");
    expect(results[results.length - 1].classes()).toContain("active");
  });

  it("输入关键词后 activeIndex 重置，Enter 打开当前选中项（设置视图）", async () => {
    const { pinia, wrapper } = mountOverlay();
    const input = wrapper.find(".search-input");
    await input.trigger("keydown.down");
    await input.trigger("keydown.down");

    await input.setValue("全局设置");
    // 外部搜索引擎行同为 .result，只断言首条为过滤后的站内项
    const results = wrapper.findAll(".result");
    expect(results[0].text()).toContain("全局设置");
    expect(results[0].classes()).toContain("active");

    await input.trigger("keydown.enter");
    const state = pinia.state.value.main;
    expect(state.setOpenState).toBe(true);
    expect(state.searchOpenState).toBe(false);
  });

  it("Enter 打开 link 项时经 window.open 新标签打开", async () => {
    const { wrapper } = mountOverlay();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const input = wrapper.find(".search-input");

    await input.setValue("博客");
    await input.trigger("keydown.enter");
    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy.mock.calls[0][2]).toContain("noopener");
    openSpy.mockRestore();
  });
});
