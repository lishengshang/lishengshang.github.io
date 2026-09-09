import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { resolve } from "path";

// 与 vite.config.ts 保持一致的插件与别名；测试环境使用 jsdom
export default defineConfig({
  plugins: [
    vue(),
    // 源码依赖 auto-import（如 composables 中的 computed），测试时同样注入
    AutoImport({
      imports: ["vue"],
    }),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
    ],
  },
  test: {
    environment: "jsdom",
  },
});
