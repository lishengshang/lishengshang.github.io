/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_LOGO_TEXT?: string;
  /** 站点元信息：构建期由 vite.config.ts define 注入（取自 package.json） */
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
