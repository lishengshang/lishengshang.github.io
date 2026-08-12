import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

const vueEssential = pluginVue.configs["flat/essential"];
const vueEssentialRules = Array.isArray(vueEssential)
  ? vueEssential.at(-1).rules
  : vueEssential.rules;
const vueParser = Array.isArray(vueEssential)
  ? vueEssential.find((config) => config.files?.includes("*.vue"))
      ?.languageOptions?.parser
  : undefined;
const [tsBase, tsEslintRecommended, tsRecommended] =
  tseslint.configs.recommended;

export default defineConfig([
  {
    ignores: ["dist/**", "auto-imports.d.ts", "components.d.ts"],
  },
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
      globals: {
        ...globals.browser,
        defineProps: "readonly",
        defineEmits: "readonly",
        withDefaults: "readonly",
        h: "readonly",
        vue: "readonly",
        ref: "readonly",
        reactive: "readonly",
        computed: "readonly",
        watch: "readonly",
        provide: "readonly",
        inject: "readonly",
        defineComponent: "readonly",
        defineAsyncComponent: "readonly",
        onBeforeMount: "readonly",
        onMounted: "readonly",
        onBeforeUnmount: "readonly",
        nextTick: "readonly",
        ElMessage: "readonly",
        $openList: "readonly",
      },
    },
    plugins: { vue: pluginVue },
    rules: {
      ...js.configs.recommended.rules,
      ...vueEssentialRules,
      "no-unused-vars": ["error", { caughtErrors: "none" }],
      "vue/multi-word-component-names": "off",
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tseslint.parser },
    },
    processor: "vue/vue",
  },
  {
    files: ["**/*.{ts,mts,cts}"],
    languageOptions: {
      ...tsBase.languageOptions,
      globals: { ...globals.browser },
    },
    plugins: { ...tsBase.plugins },
    rules: {
      ...tsEslintRecommended.rules,
      ...tsRecommended.rules,
    },
  },
]);
