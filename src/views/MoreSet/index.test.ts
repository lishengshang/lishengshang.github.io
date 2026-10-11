import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MoreSet from "./index.vue";
import { mainStore } from "@/store";

const mountPanel = () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(MoreSet, { global: { plugins: [pinia] } });
};

describe("MoreSet 设置面板", () => {
  beforeEach(() => {
    // 版本号/仓库地址为构建期 define 注入，测试环境用 stubEnv 提供
    vi.stubEnv("VITE_APP_VERSION", "5.7.0");
    vi.stubEnv(
      "VITE_APP_GITHUB",
      "https://github.com/lishengshang/lishengshang.github.io",
    );
  });

  it("渲染 define 注入的版本号与站点标识", () => {
    const wrapper = mountPanel();
    expect(wrapper.find(".version .num").text()).toContain("5.7.0");
    // useSiteUrl 未配置 VITE_SITE_URL 时回退默认域名首段
    expect(wrapper.find(".logo .bg").text()).toBe("lishengshang");
  });

  it("更新日志卡片渲染真实 CHANGELOG 条目（非空）", () => {
    const wrapper = mountPanel();
    expect(wrapper.findAll(".uptext").length).toBeGreaterThan(0);
  });

  it("关闭按钮常驻可聚焦（opacity 显隐），点击向 store 关闭设置页", async () => {
    const wrapper = mountPanel();
    const store = mainStore();
    store.setOpenState = true;
    // opacity 显隐方案：按钮始终挂载且可聚焦，焦点进入面板即通过 :focus-within 显形
    const closeBtn = wrapper.find(".close");
    expect(closeBtn.exists()).toBe(true);
    expect(closeBtn.attributes("aria-label")).toBe("关闭设置");
    await closeBtn.trigger("click");
    expect(store.setOpenState).toBe(false);
  });
});
