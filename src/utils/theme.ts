export type ThemeMode = "light" | "dark" | "auto";

// 解析生效主题：dark 固定暗色；auto 跟随系统 prefers-color-scheme
export const resolveDark = (mode: ThemeMode, systemDark: boolean): boolean =>
  mode === "dark" || (mode === "auto" && systemDark);
