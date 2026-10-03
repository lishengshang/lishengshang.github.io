import { createApp } from "vue";
import "@/style/style.scss";
import App from "@/App.vue";
// 引入 pinia
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// Element Plus 暗色主题变量（html.dark 时生效，配合站点自定义暗色令牌）
import "element-plus/theme-chalk/dark/css-vars.css";
// 点击波纹指令
import { ripple } from "@/utils/ripple";
// PWA 更新注册（prompt 模式）
import { registerSW } from "virtual:pwa-register";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
// 注册全局点击波纹指令
app.directive("ripple", ripple);
app.mount("#app");

// PWA：新版本就绪时提示，用户点击后刷新生效（避免自动切换导致懒加载 chunk 失败）
if ("serviceWorker" in navigator) {
  registerSW({
    onNeedRefresh() {
      ElNotification({
        title: "站点已更新",
        message: "点击此通知刷新页面以应用新版本",
        duration: 0,
        showClose: true,
        onClick: () => {
          window.location.reload();
        },
      });
    },
  });
}
