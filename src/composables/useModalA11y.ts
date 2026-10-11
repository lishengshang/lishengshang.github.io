import { nextTick, onBeforeUnmount, onMounted, watch } from "vue";
import type { Ref } from "vue";

// 可聚焦元素选择器；可见性由 getClientRects 过滤（v-show 的内联 display:none 无布局盒子）
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

type ModalA11yOptions = {
  /** 弹层根元素：焦点圈禁范围与初始焦点查找范围 */
  panelRef: Ref<HTMLElement | null>;
  /** Esc 触发的关闭回调 */
  onClose?: () => void;
  /** 弹层打开状态。v-if 弹层可省略（挂载即打开）；v-show 复用挂载的弹层必须传，隐藏时不拦截按键 */
  active?: Ref<boolean>;
  /** 打开后自动聚焦首个可聚焦元素；弹层自带聚焦逻辑（如搜索框）时传 false */
  autofocus?: boolean;
};

// 实例栈：多个弹层叠加时仅栈顶实例响应按键（Ctrl+K 与音乐列表叠开等边缘态）
const trapStack: number[] = [];
let trapSeq = 0;

/**
 * 模态弹层可访问性：Tab 焦点在面板内循环、Esc 关闭、
 * 打开时记录触发元素并聚焦面板、关闭时还原焦点。
 * 自实现而非引第三方 focus-trap：Element Plus 内置实现不对外导出，
 * 独立依赖仅服务这一处小逻辑，与本仓库最小依赖取向不符（见变更计划）。
 */
export const useModalA11y = (options: ModalA11yOptions): void => {
  const { panelRef, onClose, active, autofocus = true } = options;
  const trapId = ++trapSeq;
  let prevFocus: HTMLElement | null = null;
  let attached = false;

  const panelFocusables = (): HTMLElement[] => {
    const panel = panelRef.value;
    if (!panel) return [];
    return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => el.getClientRects().length > 0,
    );
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (trapStack[trapStack.length - 1] !== trapId) return;
    if (active && !active.value) return;
    if (event.key === "Escape") {
      onClose?.();
      return;
    }
    if (event.key !== "Tab") return;
    const panel = panelRef.value;
    if (!panel) return;
    const focusables = panelFocusables();
    if (!focusables.length) {
      event.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const current = document.activeElement as HTMLElement | null;
    if (!current || !panel.contains(current)) {
      // 焦点落在面板外：拉回面板内
      event.preventDefault();
      first.focus();
      return;
    }
    if (event.shiftKey && current === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const beginTrap = () => {
    if (attached) return;
    attached = true;
    prevFocus = document.activeElement as HTMLElement | null;
    trapStack.push(trapId);
    document.addEventListener("keydown", onKeyDown, true);
    if (autofocus) {
      nextTick(() => {
        if (active && !active.value) return;
        panelFocusables()[0]?.focus();
      });
    }
  };

  const endTrap = () => {
    if (!attached) return;
    attached = false;
    trapStack.splice(trapStack.indexOf(trapId), 1);
    document.removeEventListener("keydown", onKeyDown, true);
    const target = prevFocus;
    prevFocus = null;
    // 等一次渲染再还原：触发元素可能随弹层关闭刚恢复显示（如盒子内的设置按钮）
    nextTick(() => target?.focus?.());
  };

  onMounted(() => {
    if (active) {
      watch(active, (value) => (value ? beginTrap() : endTrap()), { immediate: true });
    } else {
      beginTrap();
    }
  });

  onBeforeUnmount(() => {
    if (active && !active.value) return;
    endTrap();
  });
};
