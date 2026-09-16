# ADR-0007：友链页面采用 hash 路由而非引入 vue-router

- 状态：accepted
- 日期：2026-09-16
- 影响范围：`src/views/Friends/`（新增）、`src/App.vue`、`src/store/index.ts`、`src/components/Links.vue`、`src/assets/friendLinks.json`（新增）

## 背景

路线图约定：出现第一个需要 URL 身份的独立页面（友链页）时，评估是否引入 vue-router，并同步评估 PWA `navigateFallbackDenylist` 范围。友链页面为本站第一个此类页面。

## 选项

1. 引入 vue-router（history 模式 + 单路由）。否决：仅一个二级页面即引入完整路由栈，打包体积、PWA 导航兜底与 `/blog/` 子站的边界都要重新评估，收益不成比例。
2. 引入 vue-router（hash 模式）。备选，比方案 1 轻，但仍为单页面引入依赖与目录约定。
3. Pinia 状态切换 + `#/friends` hash 双向同步。采用。

## 决策

- 新增 `friendsOpenState`（store，非持久化），App.vue 中懒加载渲染 `Friends` 全屏视图（z-index 同设置蒙层，Transition fade）。
- hash 双向同步：`watch(friendsOpenState)` 写 `location.hash`（开 `#/friends`、关 `#`），`hashchange` 事件回读状态——URL 身份成立、浏览器前进后退可用、分享 `#/friends` 链接直达。
- PWA：hash 不产生网络导航，`navigateFallbackDenylist` 无需变更；workbox 导航兜底仍只服务 `/`。
- 数据：`src/assets/friendLinks.json` 手工维护（首条为上游原作者 imsyy/home），图标沿用 Links 页 xicons 图标名映射。

## 后果

- 无新依赖，App.vue 增加约 20 行同步逻辑，复杂度远低于引入路由。
- 限制：hash 仅服务于友链页一个身份；若后续出现搜索聚合页等多个 URL 页面（超过 2~3 个），应重评 vue-router（hash 模式）并迁移。
- 手工刷新 `#/friends` 直达友链页；关闭后 URL 回落为 `#`（保留 hash 以简化同步逻辑）。

## 回滚或迁移方案

单提交变更，`git revert` 即可；`friendLinks.json` 与 Friends 视图为新增文件，回滚后删除。
