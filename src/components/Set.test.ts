import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import Set from "./Set.vue";
import { mainStore } from "@/store";

// 设置页组件测试：真实 pinia store + 真实 EP 组件（vitest 配置已带解析器）
const mountSet = () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(Set, { global: { plugins: [pinia] } });
};

describe("Set 设置页", () => {
  it("渲染四个折叠面板分组", () => {
    const wrapper = mountSet();
    const titles = wrapper.findAll(".el-collapse-item__header").map((h) => h.text());
    expect(titles).toEqual(["个性壁纸", "个性化调整", "播放器配置", "其他设置"]);
  });

  it("樱花飘落开关经 v-model 写回 store（双向绑定回归）", async () => {
    const wrapper = mountSet();
    const store = mainStore();
    expect(store.sakuraShow).toBe(true);
    const sakuraItem = wrapper
      .findAll(".item")
      .find((i) => i.text().includes("樱花飘落"))!;
    const checkbox = sakuraItem.find('input[type="checkbox"]');
    await checkbox.setValue(false);
    expect(store.sakuraShow).toBe(false);
    await checkbox.setValue(true);
    expect(store.sakuraShow).toBe(true);
  });

  it("外观主题 radio 写回 store（auto → light → dark）", async () => {
    const wrapper = mountSet();
    const store = mainStore();
    expect(store.themeMode).toBe("auto");
    const themeItem = wrapper
      .findAll(".item")
      .find((i) => i.text().includes("外观主题"))!;
    const radios = themeItem.findAll('input[type="radio"]');
    // [浅色, 暗色, 跟随系统]
    await radios[0].setValue(true);
    expect(store.themeMode).toBe("light");
    await radios[1].setValue(true);
    expect(store.themeMode).toBe("dark");
  });

  it("壁纸 radio 写回 coverType（随机风景 = 2）", async () => {
    const wrapper = mountSet();
    const store = mainStore();
    const radios = wrapper.find(".bg-set").findAll('input[type="radio"]');
    await radios[1].setValue(true); // 默认/风景/动漫
    expect(store.coverType).toBe("2");
  });
});
