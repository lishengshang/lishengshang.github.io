import { computed, ref } from "vue";
import { mainStore } from "@/store";

// 系统减弱动态偏好（模块级单例：一份 matchMedia 监听常驻，页面生命周期内共享；
// jsdom 无 matchMedia 时守卫为 false，与 useDarkMode 同模式）。
// 指令等无 setup 上下文的场景可直接 import 此 ref。
export const systemReduceMotion = ref(
  typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
);
let query: MediaQueryList | null = null;

/**
 * 降低动态效果的生效值：手动开关 OR 系统偏好。
 * prefers-reduced-motion 视为强信号——系统要求减弱时无条件生效，
 * 手动开关只能进一步关闭，不能覆盖系统偏好强行开动画。
 * 指令等无 setup 上下文的场景可直接读导出的 systemReduceMotion。
 */
export const useReducedMotion = () => {
  const store = mainStore();
  if (!query && typeof window.matchMedia === "function") {
    query = window.matchMedia("(prefers-reduced-motion: reduce)");
    query.addEventListener("change", (e) => {
      systemReduceMotion.value = e.matches;
    });
  }
  const isReduceMotion = computed(() => store.reduceMotion || systemReduceMotion.value);
  return { systemReduceMotion, isReduceMotion };
};
