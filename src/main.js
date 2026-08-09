import { createApp } from "vue";
import "@/style/style.scss";
import App from "@/App.vue";
// 引入 pinia
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// swiper
import "swiper/css";
// 点击波纹指令
import { ripple } from "@/utils/ripple";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
// 注册全局点击波纹指令
app.directive("ripple", ripple);
app.mount("#app");

// PWA
navigator.serviceWorker.addEventListener("controllerchange", () => {
  // 弹出更新提醒
  ElMessage("站点已更新，刷新后生效");
});
