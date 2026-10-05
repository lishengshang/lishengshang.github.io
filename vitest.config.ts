import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";

// 与 vite.config.ts 保持一致的插件与别名；测试环境使用 jsdom
export default defineConfig({
  plugins: [
    vue(),
    // 源码依赖 auto-import（如 composables 中的 computed），测试时同样注入
    AutoImport({
      imports: ["vue"],
    }),
    // el-* 组件为编译期自动解析：缺了它，被测组件模板里的 Element Plus 组件
    // 会以未知元素渲染，断言可能静默失真（与主配置保持一致）。
    // importStyle 关闭：测试环境不加载 EP 样式（jsdom 无法处理 theme-chalk CSS 导入）
    Components({
      resolvers: [ElementPlusResolver({ importStyle: false })],
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
