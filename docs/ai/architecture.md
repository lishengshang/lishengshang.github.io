# 当前架构基线

## 分层

项目是 Vue 3 单页静态站点。`src/App.vue` 负责应用装配，`src/views/` 负责页面级组合，`src/components/` 负责可复用 UI，`src/composables/` 负责可复用响应式逻辑，`src/store/` 负责 Pinia 状态，`src/api/` 负责外部 API，`src/utils/` 负责无 UI 的通用逻辑。

## 配置与资源

- 用户个性化配置优先放在 `.env`、`src/assets/siteLinks.json` 和 `src/assets/socialLinks.json`。
- `.env.example` 是环境变量契约；新增 `VITE_*` 变量必须同时更新它和 README。
- `public/` 中的字体、图片和图标属于静态资源，不应在运行时通过源码复制或生成。

## 外部服务

外部 API 调用应集中在 `src/api/` 或明确的 composable 中，组件不得散落重复的请求、错误兜底和 URL 拼接逻辑。新增服务前先检查是否能复用现有适配器。

## 重构边界

优先提取重复逻辑、缩小组件职责、隔离外部依赖和改善错误处理。不要仅为“看起来更现代”而整体迁移框架、替换状态管理或批量改名；这类变更必须有 ADR、迁移步骤和回滚方案。
