# ADR-0002：移除天气功能

- 状态：accepted
- 日期：2026-08-09
- 影响范围：`src/components/Weather.vue`、`src/api/index.js`、`.env.example`、`src/views/Func/index.vue`

## 背景

天气功能依赖高德开放平台 Web 服务 Key，每日调用上限为 5000 次，且需要每个部署者自行申请；同时还依赖教书先生备用 API `api.oioweb.cn`。fork 后，该功能会给每个部署者增加外部密钥申请、配额和维护风险。

主提交 `67469ae` 的原始意图是移除天气功能及相关依赖，删除天气组件、主页引用和样式，移除高德与教书先生天气 API 调用及 `VITE_WEATHER_KEY` 配置。README 功能列表与 API 清单的清理在同日相邻提交 `736d07a`（清理 README 中原作者残留信息与失效链接）中完成。前置提交 `73dab32` 已将 `Weather.vue` 中的字符串抛错改为 `throw new Error()`，并删除 `console.log`，相关信息记录在变更日志中。

## 选项

1. 保留天气功能并优化 Key 配置说明。否决，因为外部 Key 的配额和申请风险仍然存在。
2. 整体移除天气功能及其 API、配置和文档引用。采用。

## 决策

采用方案 2。删除 `src/components/Weather.vue`，从 `src/api/index.js` 删除 `getAdcode`、`getWeather` 和 `getOtherWeather`，从 `.env.example` 删除 `VITE_WEATHER_KEY` 及相关说明，并从 `src/views/Func/index.vue` 删除组件引用、导入和样式。

## 后果

外部服务从 5 个减少到 2 个，仅保留音乐 Meting 和一言 Hitokoto。部署者不再需要申请高德 Key，README 明确说明天气功能已移除。已知残留是 `components.d.ts` 第 33 行仍有陈旧的 Weather 自动导入声明，该生成文件自上游 `462aab2` 后未再提交，构建重新生成后会自行修复。`README_EN.md` 与 `CHANGELOG.md` 中的相关提及属于有意保留的文档记录。

## 回滚或迁移方案

可以使用 `git revert 67469ae` 恢复功能，但恢复后需要重新申请高德 Key 并补回环境变量配置。
