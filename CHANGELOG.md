# 变更记录

本仓库基于 [imsyy/home](https://github.com/imsyy/home) fork 维护。版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [5.2.0] - 2026-08-22

### 定制
- 站点图标全套替换为个人头像（favicon / logo / apple-touch-icon / PWA 各尺寸）
- 壁纸替换为个人收藏 10 张（统一 1920x1080 JPEG）
- 修复 `VITE_SITE_APPLE_LOGO` 错误路径（`/images/logo/` → `/images/icon/`，此前 404）

### 安全
- Footer 歌词由 `v-html` 改为纯文本渲染，消除第三方歌词注入的 XSS 面
- `main.ts` 增加 `navigator.serviceWorker` 存在性守卫
- 外链 `window.open` 显式传入 `noopener,noreferrer`

### 其他
- 设置页更新日志改为本 fork 实际变更（原为上游硬编码残留）
- `package.json` 元信息更新为 fork 信息；页脚保留原作者 imsyy 署名

## [5.1.0] - 2026-08-13

### 工程化
- 修复部署链：部署仓库 Pages 源切换为 GitHub Actions 模式，线上恢复 homepage 构建产物（此前被 Jekyll 渲染的 README 占据）
- 新增多 Agent 协作基础设施：`AGENTS.md` 统一入口、`docs/ai/` 机器可读规范与模板、`docs/ai/STATUS.md` 实时进度跟踪机制
- 建立开发前 tag 版本基线：开发点 `dev-YYYYMMDD`、里程碑 `vX.Y.Z`
- 新增 `packageManager` 与 `engines` 字段，锁定 pnpm@11.20.0 与 Node >=20
- 重写 GitHub Actions：改用 pnpm、ubuntu-latest、Node 20，新增 PR 构建检查与并发取消
- 新增 Dependabot 配置，自动追踪 npm 依赖与 GitHub Actions 版本更新
- 更新 README：说明 fork 维护性质、修正文件路径错误、更新 Node 版本要求

### 功能
- 移除天气功能（组件、API、`VITE_WEATHER_KEY` 配置及文档），同时删除高德/教书先生 API 依赖
- 修复音乐播放器默认 API 失效：`VITE_SONG_API` 未配置时兜底使用公共 Meting 实例，并增加歌单响应校验

## [5.0.0] - 重构基线

基于原项目 v4.1.4 进行全面重构，**不改变对外功能与视觉表现**，重点解决性能、内存与代码质量问题。

### 性能
- 重写 `debounce`：原实现全局共享定时器且不返回函数，无法防抖；改为标准实现（闭包 + 返回函数）
- 重写 `cursor.js`：移除 `document.getElementsByTagName("*")` 全 DOM 遍历、移除 `lodash-es/isEqual` 深比较、移除 IE 专属 `currentStyle` API；`requestAnimationFrame` 增加防重入守卫
- TimeCapsule 定时器从 1s 调整为 60s（日/周/月/年进度最快每小时才变）
- Box 改为 `v-if` 懒挂载，关闭时销毁内部定时器；Box/MoreSet 改用 `defineAsyncComponent` 按需加载

### 内存泄漏
- App.vue：补齐 `mousedown`、`contextmenu` 监听器在 `onBeforeUnmount` 中的移除
- Music.vue：补齐 `keydown` 监听器的移除

### 代码质量
- 提取 `useSiteUrl` composable，消除 4 处重复的 siteUrl 计算属性
- 简化 store：`setPlayerState` 简化为 `= !value`；移除 3 个无意义的 getter
- 用 store action `openMusicList` 替代全局 `window.$openList` 反模式
- Player.vue：try-catch 改为 async/await，修复无法捕获 Promise rejection 的问题
- api/index.js：所有 fetch 调用增加 `res.ok` 检查
- Weather.vue：`throw "字符串"` 改为 `throw new Error()`
- 移除未使用依赖 `axios`、`lodash-es`

### 清理
- 移除 index.html 中过时的 IE 检测脚本
- 移除 style.scss 中多余的 `@charset "utf-8"`
- 清理各处 `console.log` 调试语句
- 移除 cursor.js、debounce.js 中残留的 `var`

### 注意
本次为内部重构，**不包含** Vite 4→5/6 升级、ESLint 8→9 迁移、TypeScript 迁移。这些将在后续版本分阶段推进。
