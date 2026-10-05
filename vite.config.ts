import { defineConfig, loadEnv } from "vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { compression } from "vite-plugin-compression2";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
  // 站点元信息构建期注入（取自 package.json，替代组件内整包 import）
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkg.version),
    "import.meta.env.VITE_APP_HOME": JSON.stringify(pkg.home),
    "import.meta.env.VITE_APP_GITHUB": JSON.stringify(pkg.github),
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"],
      resolvers: [ElementPlusResolver()],
      // 生成 .eslintrc-auto-import.json（提交进仓库），ESLint 全局变量改为自动同步
      eslintrc: {
        enabled: true,
        globalsPropValue: "readonly",
      },
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    VitePWA({
      // prompt 模式：新版本就绪时由应用提示用户手动刷新，避免新旧构建交替期间懒加载 chunk 失败
      registerType: "prompt",
      workbox: {
        // 导航兜底不拦截 /blog/ 子站点，避免访问博客时被渲染为首页
        navigateFallbackDenylist: [/^\/blog(?:\/|$)/],
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(js|css|woff2|woff|ttf)/, // js / css 静态资源缓存
            handler: "CacheFirst",
            options: {
              cacheName: "js-css-cache",
              // 限制条目并在配额告急时自动清理，避免缓存随浏览无限累积
              expiration: { maxEntries: 60, purgeOnQuotaError: true },
              // 仅缓存显式 200（本仓 js/css 均为同源产物，状态码可见），
              // 接口抖动期的 4xx/5xx 响应不再被 CacheFirst 长期缓存
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /(.*?)\.(png|jpe?g|webp|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存（含 webp 本地壁纸）
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: { maxEntries: 60, purgeOnQuotaError: true },
              // 外部随机壁纸为 no-cors 跨域请求（opaque 响应 status=0）需放行 0；
              // 其余异常状态不再写入缓存，避免壁纸源抖动时缓存住失败图
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: env.VITE_SITE_NAME,
        short_name: env.VITE_SITE_NAME,
        description: env.VITE_SITE_DES,
        display: "standalone",
        start_url: "/",
        theme_color: "#424242",
        background_color: "#424242",
        icons: [
          {
            src: "/images/icon/48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/images/icon/72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/images/icon/96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/images/icon/128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/images/icon/144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/images/icon/192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/images/icon/512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    // 仅产出 gzip 预压缩文件：nginx:alpine 无 brotli 模块（gzip_static 只取 .gz），
    // GitHub Pages 亦不消费 .br，全量产出 .br 属死产物
    compression({ algorithms: ["gzip"] }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
        additionalData: `@use "${resolve(__dirname, "src/style/global.scss").replace(/\\/g, "/")}" as *;`,
      },
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        pure_funcs: ["console.log"],
      },
    },
    rollupOptions: {
      output: {
        // vendor 分包：依赖升级时只失效对应 chunk，提升浏览器缓存复用
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("element-plus") || id.includes("@element-plus")) return "element-plus";
          if (id.includes("aplayer")) return "aplayer";
          return "vendor";
        },
      },
    },
  },
  };
});
