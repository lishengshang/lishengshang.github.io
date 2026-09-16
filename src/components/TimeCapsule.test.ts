import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TimeCapsule from "./TimeCapsule.vue";
import { mainStore } from "@/store";

// el-progress 未在测试环境注册，用透传 stub 保留插槽内容
const ElProgressStub = { template: "<div class='el-progress-stub' />" };

const mountCapsule = () =>
  mount(TimeCapsule, {
    global: {
      plugins: [createPinia()],
      stubs: { ElProgress: ElProgressStub, "el-progress": ElProgressStub },
    },
  });

describe("TimeCapsule", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_SITE_START", "2025-06-08");
  });

  it("渲染日/周/月/年四个进度条", () => {
    const wrapper = mountCapsule();
    const items = wrapper.findAll(".capsule-item");
    expect(items).toHaveLength(4);
    expect(wrapper.text()).toContain("今日已度过");
    expect(wrapper.text()).toContain("本周已度过");
    expect(wrapper.text()).toContain("本月已度过");
    expect(wrapper.text()).toContain("本年已度过");
  });

  it("siteStartShow 开启时建站日期文本挂载后立即可见（不等待 60s 定时器）", () => {
    const wrapper = mountCapsule();
    const store = mainStore();
    store.siteStartShow = true;
    return vi.waitFor(() => {
      // 修复回归点：onMounted 立即计算，无需等 interval
      expect(wrapper.find(".capsule-item.start").exists()).toBe(true);
      expect(wrapper.text()).toContain("本站已经苟活了");
    });
  });

  it("siteStartShow 关闭时不渲染建站日期条目", () => {
    const wrapper = mountCapsule();
    expect(wrapper.find(".capsule-item.start").exists()).toBe(false);
  });
});
