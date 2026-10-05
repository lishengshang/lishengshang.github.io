/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// 环境变量全量声明：与 .env.example 一一对应（该文件即 CI 生产配置真源）。
// 声明后 env 相关代码离开 any 兜底，拼写错误在 typecheck 即暴露；
// 站点类变量均可选（.env 中可留空/缺省），代码侧以 `||`/`??` 提供回退值。
interface ImportMetaEnv {
  // 站点信息
  readonly VITE_SITE_NAME?: string;
  readonly VITE_SITE_AUTHOR?: string;
  readonly VITE_SITE_KEYWORDS?: string;
  readonly VITE_SITE_DES?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_SITE_LOGO_TEXT?: string;
  readonly VITE_SITE_LOGO?: string;
  readonly VITE_SITE_MAIN_LOGO?: string;
  readonly VITE_SITE_APPLE_LOGO?: string;
  // 简介文本
  readonly VITE_DESC_HELLO?: string;
  readonly VITE_DESC_TEXT?: string;
  readonly VITE_DESC_HELLO_OTHER?: string;
  readonly VITE_DESC_TEXT_OTHER?: string;
  // 建站日期（YYYY-MM-DD 或 YYYY）
  readonly VITE_SITE_START?: string;
  // 外部壁纸源
  readonly VITE_WALLPAPER_VIEWS?: string;
  readonly VITE_WALLPAPER_ACG?: string;
  // ICP 备案号
  readonly VITE_SITE_ICP?: string;
  // 歌曲 API（Meting 兼容）
  readonly VITE_SONG_API?: string;
  readonly VITE_SONG_SERVER?: string;
  readonly VITE_SONG_TYPE?: string;
  readonly VITE_SONG_ID?: string;
  // 站点元信息：构建期由 vite.config.ts define 注入（取自 package.json）
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_HOME: string;
  readonly VITE_APP_GITHUB: string;
}

declare module "fetch-jsonp" {
  const fetchJsonp: (url: string) => Promise<Response>;
  export default fetchJsonp;
}

declare module "@worstone/vue-aplayer" {
  import type { DefineComponent } from "vue";

  const APlayer: DefineComponent;
  export default APlayer;
}
