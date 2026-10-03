import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import { readFileSync } from "node:fs";

// unplugin-auto-import 生成的全局变量清单（vite.config.ts AutoImport.eslintrc 维护，依赖变化后重新生成并提交）
const autoImportGlobals = JSON.parse(
  readFileSync(new URL("./.eslintrc-auto-import.json", import.meta.url), "utf8"),
).globals;

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
        ...autoImportGlobals,
        // 编译宏不进 auto-import 清单，仅 .vue 编译期存在，需手工声明
        defineProps: "readonly",
        defineEmits: "readonly",
        withDefaults: "readonly",
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
