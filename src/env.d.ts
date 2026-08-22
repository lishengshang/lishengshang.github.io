/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_LOGO_TEXT?: string;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent;
  export default component;
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
