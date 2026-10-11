import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useModalA11y } from "./useModalA11y";

// jsdom 无布局引擎（getClientRects 恒为空列表），桩成"有盒子"以模拟可见元素
const stubClientRects = () =>
  vi
    .spyOn(HTMLElement.prototype, "getClientRects")
    .mockReturnValue([{}] as unknown as DOMRectList);

const pressKey = (target: Element, key: string, init: KeyboardEventInit = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, ...init }));
};

// 测试宿主：外层触发按钮 + 常驻面板（模拟 v-show 复用挂载，active 手动开关）。
// attachTo: document.body 必需——jsdom 仅对已连接文档的元素实现 focus()
const buildHost = (onClose: () => void, autofocus = true) => {
  const active = ref(false);
  const Host = defineComponent({
    setup() {
      const panelRef = ref<HTMLElement | null>(null);
      useModalA11y({ panelRef, active, onClose, autofocus });
      // 注意：原始 render 函数中字符串 ref 不会绑定 setup 变量（SFC 编译器行为），必须用函数式 ref
      return () =>
        h("div", [
          h("button", { class: "trigger" }, "触发"),
          h(
            "div",
            {
              ref: (el) => (panelRef.value = el as HTMLElement | null),
              class: "panel",
              role: "dialog",
              style: active.value ? "" : "display:none",
            },
            [h("button", { class: "first" }, "第一项"), h("button", { class: "last" }, "第二项")],
          ),
        ]);
    },
  });
  return { Host, active };
};

describe("useModalA11y 弹层焦点圈禁", () => {
  let wrapper: VueWrapper | null = null;

  const mountHost = async (onClose: () => void, autofocus = true, activate = true) => {
    const { Host, active } = buildHost(onClose, autofocus);
    wrapper = mount(Host, { attachTo: document.body });
    if (activate) {
      active.value = true;
      await nextTick();
      await nextTick();
    }
    return {
      active,
      trigger: wrapper.find(".trigger").element as HTMLElement,
      first: wrapper.find(".first").element as HTMLElement,
      last: wrapper.find(".last").element as HTMLElement,
      panel: wrapper.find(".panel").element as HTMLElement,
    };
  };

  beforeEach(() => {
    stubClientRects();
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
    vi.restoreAllMocks();
  });

  it("激活后自动聚焦面板首个可聚焦元素", async () => {
    const { first } = await mountHost(() => {}, true);
    expect(document.activeElement).toBe(first);
  });

  it("Tab 在面板内循环，Shift+Tab 反向", async () => {
    const { first, last } = await mountHost(() => {}, false);

    last.focus();
    pressKey(last, "Tab");
    expect(document.activeElement).toBe(first);

    first.focus();
    pressKey(first, "Tab", { shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("焦点落在面板外时拉回面板内", async () => {
    const { trigger, first } = await mountHost(() => {}, false);

    trigger.focus();
    pressKey(trigger, "Tab");
    expect(document.activeElement).toBe(first);
  });

  it("Esc 触发关闭回调", async () => {
    const onClose = vi.fn();
    const { panel } = await mountHost(onClose, false);

    pressKey(panel, "Escape");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("停用后焦点还原到打开前的触发元素", async () => {
    // 延迟激活：先让 trigger 持焦，模拟「点击触发元素打开弹层」
    const { active, trigger, first } = await mountHost(() => {}, false, false);
    trigger.focus();

    active.value = true;
    await nextTick();
    await nextTick();
    first.focus();
    expect(document.activeElement).toBe(first);

    active.value = false;
    await nextTick();
    await nextTick();
    expect(document.activeElement).toBe(trigger);
  });
});
