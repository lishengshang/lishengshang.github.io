import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import Footer from "./Footer.vue";
import { mainStore } from "@/store";

const mountFooter = () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(Footer, { global: { plugins: [pinia] } });
};

describe("Footer", () => {
  it("未播放时渲染版权区", () => {
    const wrapper = mountFooter();
    expect(wrapper.find(".power").exists()).toBe(true);
    expect(wrapper.find(".lrc").exists()).toBe(false);
  });

  it("播放且开启歌词显示时切换为歌词区（v-once 回归点：条件须可重新求值）", async () => {
    const wrapper = mountFooter();
    const store = mainStore();
    store.playerState = true;
    store.playerLrcShow = true;
    store.playerLrc = "测试歌词一行";
    await nextTick();
    // out-in 过渡离场依赖 rAF（jsdom 下约两帧），用 waitFor 等待切换完成
    await vi.waitFor(() => {
      expect(wrapper.find(".lrc").exists()).toBe(true);
    });
    expect(wrapper.find(".lrc-text").text()).toContain("测试歌词一行");
    expect(wrapper.find(".power").exists()).toBe(false);
  });

  it("歌词显示开关往返切换均生效（证明 v-if 条件持续求值）", async () => {
    const wrapper = mountFooter();
    const store = mainStore();
    store.playerState = true;
    store.playerLrcShow = true;
    await nextTick();
    await vi.waitFor(() => expect(wrapper.find(".lrc").exists()).toBe(true));

    store.playerLrcShow = false;
    await nextTick();
    await vi.waitFor(() => expect(wrapper.find(".power").exists()).toBe(true));

    store.playerLrcShow = true;
    await nextTick();
    await vi.waitFor(() => expect(wrapper.find(".lrc").exists()).toBe(true));
  });

  it("无备案号时不渲染备案锚点与孤立的「&」段", () => {
    vi.stubEnv("VITE_SITE_ICP", "");
    const wrapper = mountFooter();
    expect(wrapper.find('a[href="https://beian.miit.gov.cn"]').exists()).toBe(false);
    // 修复点：备案 span 整体不渲染（原先恒渲染、仅内部 a 受 v-if 控制，会留下孤立「&」）
    const orphan = wrapper
      .find(".power")
      .findAll("span")
      .filter((s) => s.text().trim() === "&");
    expect(orphan).toHaveLength(0);
    vi.unstubAllEnvs();
  });
});
