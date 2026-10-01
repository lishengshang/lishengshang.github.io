import { computed, ref } from "vue";
import { mainStore } from "@/store";
import { resolveDark } from "@/utils/theme";

// 系统深浅色偏好（模块级单例：多消费方共享一份 matchMedia 监听，页面生命周期内常驻）
const systemDark = ref(
  typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches,
);
let query: MediaQueryList | null = null;

export const useDarkMode = () => {
  const store = mainStore();
  if (!query && typeof window.matchMedia === "function") {
    query = window.matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", (e) => {
      systemDark.value = e.matches;
    });
  }
  const isDark = computed(() => resolveDark(store.themeMode, systemDark.value));
  return { isDark };
};
