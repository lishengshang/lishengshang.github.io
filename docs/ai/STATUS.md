# 协作进度

多 Agent 轮流协作的唯一实时进度文件；开工前必读、交接后必更新。

## 使用规则

- 新会话第一步读取本文件，掌握当前进度与下一步。
- 会话结束前必须更新当前进度、下一步和会话记录。
- 本文件与 `docs/ai/templates/handoff.md` 字段一致。

## 当前进度

- 2026-09-13（第三场）线上验证闭环：Deploy #8（da431f1）生效，浏览器实测艺术字 "liremio'"（Pacifico、桌面 .long 56px）与 `<title>` "liremio の主页" 均正确；9-09 遗留三项冒烟（壁纸切换/设置持久化/Links 轮播）全部通过。Dockerfile 重写落地（ADR-0006：Node 22-alpine + pnpm 多阶段 + nginx:alpine），四门禁全绿；本机无 Docker，镜像构建验证遗留。

## 已完成

- 2026-09-09 依赖升级（分支 feat/dep-upgrade，ADR-0005）：Vue 3.5.42 / Pinia 3.0.4（persistedstate v4 `paths`→`pick`）/ Vite 7.3.6 / Element Plus **2.13.0（锁定，2.14.0 起按需导入 tree-shaking 失效）** / swiper 12.1.2 / nanoid override（pnpm-workspace.yaml）；`pnpm audit --prod` 15 漏洞（1 critical）→ 0；产物 44 文件字节级一致、9 chunk 同拓扑重建，precache 552.93→590.46 KiB；版本 5.2.0→5.4.0（补正 5.3.0 未落包号的不一致）。
- 2026-09-09 测试基建：引入 Vitest 5 + @vue/test-utils + jsdom，新增 `vitest.config.ts`、`pnpm test` / `pnpm lint:check` 脚本，新增 utils/api/composables 4 个测试文件 20 个用例（含 API 超时降级中止路径）；CI（build.yml）新增 lint (无 --fix) 与 unit test 门禁；CHANGELOG [Unreleased] 补记。
- 2026-09-03 仓库更名为 `lishengshang.github.io`（原站点仓库自动改名 `lishengshang.github.io-old`，观察期后归档/删除），部署链路收敛为本仓库 `deploy.yml`（push main → 构建 → deploy-pages），删除 `dispatch.yml` 与 `PUBLISH_TOKEN` 依赖，Pages 由 legacy 切回 workflow 模式，线上验证 200 且产物为最新构建（ADR-0004），提交：`bb757e7`。
- 2026-09-03 全面 review 修复并合并 main：外部接口 5s 超时降级（ADR-0003 约束补齐）、静音音量刷新回退修复、空格键焦点过滤、APlayer 空值守卫、欢迎提示移除 HTML 渲染、社交链接 noopener/alt、无效 CORS meta 清理、cursor 改 addEventListener（提交 `d21b09b`..`4b7b1cc`，合并 `64d9174`）。
- 2026-09-03 vite.config.js → vite.config.ts 迁移，提交：`6ef783e`。
- v5.0.0 重构基线（原作者遗留），提交：`73dab32`。
- 自 v5.0.0 以来的提交清单：
  - `352165e docs: 补充 AI 协作脚手架（AGENTS/CLAUDE/Cursor/Copilot/docs-ai 模板与入口）`
  - `57d9a77 docs: 更新维护架构说明与 fork 使用指引`
  - `a69bd5a ci: push 后自动通知部署仓库同步；站点信息改为自有配置`
  - `e0cbd45 chore: 站点兜底域名改为 lishengshang.github.io`
  - `fc6163c feat: 站点链接改为自有配置，博客指向 /blog/`
  - `67469ae feat: 移除天气功能及相关依赖`
  - `99e3a1b fix: 修复音乐播放器加载失败`
  - `736d07a docs: 清理 README 中原作者残留信息与失效链接`
  - `8879611 feat: 新增樱花飘落、入场动画与点击波纹动效`
  - `4f416e8 build: 升级 Vite 4 → 5 及相关插件`
  - `06e155c ci: 修复 pnpm 版本冲突，Node 20 升级到 24`
- 2026-08-13 协作脚手架提交 + tag `dev-20260813`（回滚基线），提交：`352165e`。
- 2026-08-13 GitHub Pages 部署链修复：部署仓库 Pages 源由分支模式切换为 GitHub Actions 模式（`build_type: legacy → workflow`），站点重新部署并验证线上为 Vite 构建产物。
- 2026-08-13 STATUS.md 进度跟踪机制建立并接入协作流程，提交：`63c5f5f`。
- CHANGELOG [Unreleased] 条目摘要：CI 重写、Dependabot、天气移除、音乐修复。
- 补记 3 份 ADR（CI 重写/天气移除/站点配置迁移），提交：`ba0a1e4`。
- ESLint 8 → 9 flat config 迁移（含 typescript-eslint），提交：`1143d3d`。
- 源码迁移至 TypeScript（8 文件 + 18 SFC + tsconfig + typecheck），提交：`d8abebf`。
- Vite 5 → 6 升级（vite-plugin-pwa 同步至 1.3.0，构建产物一致），提交：`4945efe`。
- CI 接入 `pnpm typecheck` 门禁并升级 GitHub Actions 至新大版本（消除 Node 20 弃用标注），提交：`36b4931`、`e4444a1`；部署仓库工作流同步升级，提交：`17d2305`（lishengshang.github.io）。
- 修复 PWA 导航兜底拦截 `/blog/` 子站点（workbox `navigateFallbackDenylist`），提交：`f25524b`。
- 2026-08-22 5.2.0 个人化定制 + 安全修复（分支 `feat/custom-homepage`）：图标/壁纸全套个人化、apple-touch-icon 路径 404 修复、歌词 XSS、serviceWorker 守卫、外链 noopener、更新日志与元信息更新，提交：`70e7e49`、`f06a686`。

## 下一步

评审后拟定路线图（优先级从高到低，详见 2026-08-13 评审会话记录；安全项 2026-08-22、可靠性 2026-09-03、测试基建与 lint 门禁 2026-09-09、依赖升级 2026-09-09 均已完成；工程化已达合理上限，流程类项冻结）：

1. **跟进项**：Element Plus 2.14+ 上游修复 barrel tree-shaking 后跟进升级（验证标准：precache 应回 ~590 KiB 水位，详见 ADR-0005）；重写 Dockerfile（Node 22 + pnpm + 静态镜像，当前 Node 18 + npm 与基线冲突）。
2. **功能**：设置页补全（樱花开关、动画开关、降低动态效果、壁纸模糊度等）；硬编码更新日志改为自动读取 CHANGELOG（当前为手动维护）；候选新功能（搜索聚合、多语言、暗色模式、友链页面等）经 PR 评审后分批落地。
3. **路由（条件触发）**：当前单屏应用无需 vue-router（视图切换走 Pinia + Transition，`/blog/` 为独立子站）。仅当出现需要 URL 身份的独立页面（如独立的友链页 `xxx/links`、搜索聚合页）时再引入，届时同步评估 PWA `navigateFallbackDenylist` 范围。
4. **小杂项**：`npx update-browserslist-db@latest` 定期执行。

## 会话记录

### 2026-08-13

#### 摘要

建立回滚基线 tag、修复 Pages 部署链（已完成，见验证）、创建本进度文件。

#### 涉及文件

- `AGENTS.md`：接入开工前读取和交接后更新规则。
- `docs/ai/README.md`：补充 STATUS.md 文件职责。
- `docs/ai/agent-spec.yaml`：补充实时进度文件及更新策略。
- `docs/ai/STATUS.md`：创建实时进度记录。
- 部署链修复未改动本仓库文件：仅通过 GitHub API 将部署仓库 `lishengshang.github.io` 的 Pages 源切换为 GitHub Actions 模式（`.github/workflows/dispatch.yml` 与部署仓库 `build.yml` 均为既有文件）。

#### 验证

- `git tag dev-20260813` 与 `HEAD` 一致：通过。
- `pnpm lint`：通过，exit 0。
- `pnpm build`：通过，exit 0。
- Pages 部署链：部署仓库 Pages 源 `build_type: legacy → workflow` 切换成功；手动触发 Deploy 工作流（run `31619032996`）成功；线上验证 `curl https://lishengshang.github.io/` 含 Vite 构建标记 `id="app"`、`/assets/`、`manifest.webmanifest`，无 Jekyll 标记。

#### 风险与缺口

- Pages CDN 缓存可能存在延迟。
- `PUBLISH_TOKEN` 为 classic token，作用域有限。

#### 下一步

- 见上文 `## 下一步`。

#### 第二阶段：四项开发（ADR/ESLint/TS/Vite）

##### 摘要

完成四项开发：ADR 补记×3、ESLint 8→9、TypeScript 迁移、Vite 5→6；全部通过 lint/typecheck/build 三门槛。

##### 涉及文件

- `docs/ai/decisions/` 3 份 ADR、`eslint.config.js`、`tsconfig.json`、`src/env.d.ts`、8 个 js→ts、18 个 SFC、`index.html`、`package.json`、`pnpm-lock.yaml`。

##### 验证

- `pnpm lint` exit 0、`pnpm typecheck` exit 0、`pnpm build` exit 0（每提交逐一执行）。
- Vite 6 构建产物与基线一致（`dist/assets` 14/14，sw/manifest/workbox 在位）；dev 冒烟通过。

##### 风险与缺口

- vite-plugin-pwa 0.20.5→1.3.0 跨大版本（已按 peer 验证 + 产物对比确认）。
- `vue` 全局与 ElMessage 依赖 auto-imports.d.ts 生成物。
- LSP 服务器在本环境不可用（以 vue-tsc 为准）。

##### 下一步

- 见上文 `## 下一步`。

#### 第三阶段：全仓评审与路线图（未改代码）

##### 摘要

对全仓做代码审查 + 同类项目调研，产出优化路线图。未修改源码，仅更新本文件。

##### 结论

- 现状：lint/typecheck/build 三门槛通过；CI（Build/Notify）绿；线上站点与本地构建产物哈希一致；5.1.0 重构 + 工程化升级整体扎实。
- 关键发现：①Footer 歌词 `v-html` 存在第三方歌词注入的 XSS 面；②`navigator.serviceWorker` 无守卫（不支持的浏览器会抛错）；③`pnpm audit --prod` 15 个漏洞（swiper 原型污染 critical、element-plus 携带的 lodash、vue/compiler-sfc 链上的 postcss/nanoid），均可通过依赖升级消除；④无任何测试（Vitest 缺位）、CI 缺 lint 门禁；⑤Dockerfile 使用 Node 18 + npm 与项目基线（Node>=22 + pnpm）冲突；⑥外部 API（一言/壁纸/Meting）无超时与降级；⑦dev 分支落后 main 9 个提交；⑧MoreSet 更新日志为原作者硬编码残留。

##### 涉及文件

- 仅 `docs/ai/STATUS.md`（评审记录与路线图）。

##### 验证

- `pnpm typecheck` / `pnpm lint` / `pnpm build`：均通过，exit 0。
- `pnpm audit --prod`：15 vulnerabilities（1 critical / 6 high / 8 moderate）。
- 线上 `lishengshang.github.io`：HTTP 200，产物哈希与本地 dist 一致。

##### 风险与缺口

- 依赖大版本升级（Vue 3.5 / Vite 7 / Pinia 3 / Element Plus 2.11+）属高风险变更，需 ADR 与产物对比，不可与功能开发混在同一 PR。

##### 下一步

- 见上文 `## 下一步`。

### 2026-08-22

#### 5.2.0 个人化定制 + 安全修复（分支 feat/custom-homepage）

##### 摘要

按用户选择完成站点个人化（图标用 `anime_s.jpg` 生成全套、壁纸从个人收藏挑选 10 张压缩替换、歌单与简介保留）与路线图安全项修复；顺带修复 apple-touch-icon 路径 404、更新日志硬编码残留与 package.json 元信息，版本升至 5.2.0。

##### 涉及文件

- `public/images/icon/*`：favicon.ico（PNG-in-ICO 256x256）、logo.png、apple-touch-icon.png（原为 JPEG 伪装 PNG，现为真 PNG）及 32~512 全部 PWA 尺寸。
- `public/images/background1-10.jpg`：替换为个人收藏（7 动漫向 + 3 风景向），统一 1920x1080 JPEG（sips 缩放 + 居中裁切 + 质量 80，140~708K）。
- `.env.example`（及本地 `.env`，未入库）：`VITE_SITE_APPLE_LOGO` 路径修复。
- `src/components/Footer.vue`：歌词 `v-html` → 纯文本插值；原作者署名固定指向 imsyy/home。
- `src/main.ts`：`navigator.serviceWorker` 存在性守卫。
- `src/components/Links.vue`、`src/views/MoreSet/index.vue`：`window.open` 显式 `noopener,noreferrer`；MoreSet 更新日志改为本 fork 实际变更。
- `package.json`：author/github/home 改为 fork 信息，版本 5.1.0 → 5.2.0。
- `CHANGELOG.md`：补 5.2.0 条目。

##### 验证

- `pnpm lint` / `pnpm typecheck` / `pnpm build`：均通过，exit 0（precache 17 entries / 548.80 KiB）。
- `file` 校验：favicon.ico 为合法 MS Windows icon resource；background*.jpg 均为 1920x1080 JPEG。

##### 风险与缺口

- 壁纸挑选基于文件名/规格启发式（当前模型无法预览图片内容），用户尚未预览确认，可能需要替换个别图片。
- `.env` 为 gitignore 文件，本地修改不随仓库分发；部署链使用 `.env.example` 已同步修复。
- 分支未合并 main、未推送远端，线上仍为 5.1.0。

##### 下一步

- 用户 `pnpm dev` 预览确认壁纸/图标效果，不满意可指定替换；确认后合并 main 并推送触发部署。

#### 5.3.0 全仓性能审查与优化（同日第二场）

##### 摘要

应用户「高性能、轻量化」要求做全仓审查。结论：整体非屎山（v5.0 重构 + 工程化升级质量良好），修复 6 处遗留问题并落地 4 项性能优化（用户确认）。版本升至 5.3.0。

##### 审查发现与处置

- 已直接修复：死资产 `Pacifico-Regular-all.ttf`（315KB）；Sakura `visibilitychange` 匿名监听器泄漏；cursor.ts 死代码（`refresh()`/`mainCursor`）；Right.vue 移动端 Logo 与桌面不一致；控制台「無名の主页」与一言兜底「無名」品牌残留。提交：`7adb78e`。
- 用户确认后落地：①音乐懒加载（aplayer `defineAsyncComponent` + 弹窗 `v-if` 首开挂载 + fetch-jsonp 动态导入，首屏 0 条 aplayer 请求，行为变化：空格播放需先开过列表）；②vendor 分包（element-plus/aplayer/vendor 三 chunk）；③壁纸 WebP（3.6MB→1.2MB）；④HarmonyOS Sans 非阻塞加载。提交：`15b36e8`。
- 审查通过未改动：樱花 Canvas（rAF+隐藏暂停）、光标（rAF 节流）、波纹（animationend 清理）、时钟/胶囊定时器、Box/MoreSet 懒加载、EP 按需导入。

##### 验证

- `pnpm lint` / `pnpm typecheck` / `pnpm build`：均通过。
- dist 6.2MB → 3.5MB（-44%）；壁纸 -67%；首屏 3 chunk（index 29.5K + vendor 245.6K + element-plus 99.6K），aplayer 44.4K 独立懒加载。
- 浏览器实测：首屏 0 条 aplayer 请求；点击音乐列表后懒加载成功，19 首歌单正常；WebP 壁纸 200；站名无后缀。

##### 风险与缺口

- `musicIsOk` 语义变化：Player 懒加载后仅在首次打开列表且歌单加载成功后才为 true（空格播放依赖此状态，属合理行为）。
- WebP 兼容性：现代浏览器全支持；PWA 图片缓存正则已覆盖 webp。
- 行为变化：歌单 API 请求从首屏移至首次打开音乐列表。

##### 下一步

- 用户预览确认；后续可做路线图剩余项（外部 API 超时降级、Vitest、Dockerfile、依赖升级）。

### 2026-09-09

#### 测试基建：Vitest 单测 + CI lint/test 门禁

##### 摘要

按路线图「工程化」项落地测试基建：引入 Vitest 5 + @vue/test-utils + jsdom，为 `utils/`、`api/`、`composables/` 补首批单测，CI（build.yml）新增 lint（无 `--fix`）与 unit test 门禁。源码零改动，纯增量。

##### 涉及文件

- `package.json` / `pnpm-lock.yaml`：dev 依赖 vitest@5、@vue/test-utils、jsdom；新增 `test`、`lint:check` 脚本。
- `vitest.config.ts`：新增（vue 插件 + AutoImport + `@` 别名 + jsdom 环境）。
- `src/utils/debounce.test.ts`、`src/utils/getTime.test.ts`、`src/api/index.test.ts`、`src/composables/useSiteUrl.test.ts`：新增，共 20 个用例（含 API 5s 超时中止路径、`VITE_SONG_API` 覆盖需 resetModules 动态导入）。
- `.github/workflows/build.yml`：Install 后依次插入 Lint Check（`pnpm lint:check`）与 Unit Test（`pnpm test`）两步。
- `CHANGELOG.md`：[Unreleased] 补记。
- 提交：`f0bf17b`（chore 依赖）、`0c4510f`（test 配置与用例）、`0d4545f`（ci 门禁）、`5e31525`（docs 进度），待推送。

##### 验证

- `pnpm test`：4 文件 20 用例全过。
- `pnpm lint:check` / `pnpm typecheck` / `pnpm build`：均 exit 0（precache 22 entries / 552.93 KiB）。

##### 风险与缺口

- 测试文件位于 `src/` 内并纳入 vue-tsc 与 ESLint 范围（显式 import vitest API，未用 globals）。
- @vue/test-utils 已安装但组件级测试尚未覆盖（本批仅纯函数/composable）。
- `VITE_SONG_API` 覆盖测试依赖 `vi.resetModules()`，若后续将 SONG_API 改为函数内求值需同步调整。

##### 下一步

- 见上文 `## 下一步`（建议：Dockerfile 重写或依赖升级）。

### 2026-09-09（第二场）

#### 依赖升级 5.4.0（分支 feat/dep-upgrade，ADR-0005）

##### 摘要

按路线图完成核心依赖大版本升级：Vue 3.5 / Pinia 3 / Vite 7 / EP 2.13 / swiper 12.1.2 + nanoid override，消除全部生产审计漏洞；含产物哈希对比验证与 EP 2.14 tree-shaking 回归的发现与决策。

##### 涉及文件

- `package.json` / `pnpm-lock.yaml` / `pnpm-workspace.yaml`（overrides，pnpm 11 从此处读取而非 package.json `pnpm.overrides`）。
- `src/store/index.ts`：persistedstate v4 `paths` → `pick`（唯一源码改动）。
- `docs/ai/decisions/0005-dependency-upgrade.md`：新增 ADR（含 EP 2.14.0+ 摇树失效实测数据与决策）。
- `CHANGELOG.md` / `docs/ai/STATUS.md` / `package.json` 版本 5.2.0 → 5.4.0（补正 5.3.0 未落包号的不一致）。

##### 验证

- `pnpm lint:check` / `pnpm typecheck` / `pnpm test`（20 用例）/ `pnpm build`：均通过。
- `pnpm audit --prod`：15（1 critical）→ 0。
- 产物对比：44 文件字节级一致；9 个 JS/CSS chunk 同拓扑重建（无增减）；index.html/sw.js 引用更新。precache 552.93 → 590.46 KiB。

##### 风险与缺口

- EP 锁定 2.13.0：2.14.0 起按需导入全量打包（+730 KiB），根因未深究，待上游修复后跟进。
- swiper 11 → 12 跨大版本，仅 Links 页轮播使用，构建验证通过但未做浏览器实测。
- Pinia 3 语义与 Pinia 2 在本项目用法下无差异（options store + persist），未发现行为变化。

##### 下一步

- 已合并 main（merge `7fda330`）并推送，Build/Deploy 双绿；线上验证 200、资产哈希为升级后构建、bundle 版本 5.4.0。
- 待办：浏览器冒烟壁纸切换、设置持久化（localStorage `data` key）、Links 轮播（swiper 12 唯一未实测点）。

### 2026-09-13

#### 站名艺术字修复（统一为 liremio の主页）

##### 摘要

用户发现线上站名艺术字（Message.vue 左侧 logo 区 `<span class="bg">`，XPath `body/div[1]/main/div/section/div[1]/div[1]/div[1]/div/span`）仍显示 "lishengshang"。根因：该元素读取 `VITE_SITE_LOGO_TEXT || siteUrl[0]`（域名首段回退），而 commit `26011bc` 仅改了 `VITE_SITE_NAME`（只影响 `<title>`、加载页与 PWA manifest），未触及艺术字取值链，属配置链路认知偏差而非部署故障（部署本身正常，线上 title 已是 "liremio 的主页"）。修复：将 `VITE_SITE_NAME` 与 `VITE_SITE_LOGO_TEXT` 统一为 "liremio の主页"（"の" 与 App.vue 控制台输出、用户预期一致）。

##### 涉及文件

- `.env.example`：`VITE_SITE_NAME` "liremio 的主页" → "liremio の主页"；`VITE_SITE_LOGO_TEXT` `""` → "liremio の主页"（CI `cp .env.example .env` 后随构建生效；该变量由 e0596d1 为自定义艺术字而引入，此为首次赋值）。
- `.env`（gitignore，未入库）：同步以上两值。
- `docs/ai/STATUS.md`：本记录。源码零改动。

##### 验证

- `pnpm build`：通过（19.27s，precache 22 entries / 591.28 KiB）。
- 产物核验：`dist/index.html` title 为 "liremio の主页"；`dist/assets/index-*.js` 与 `dist/manifest.webmanifest` 均含该字符串（env 构建期静态替换）。
- 提交推送触发 Deploy 工作流，线上待部署完成后浏览器验证。

##### 风险与缺口

- "liremio の主页" 共 10 字符，触发 `logoText.length >= 6` 的 `.long` 缩字号样式（桌面 5rem→3.5rem，移动 4.5rem→3rem），显示效果待浏览器确认。
- 本机无系统级 Node/pnpm（`where node` 不可见），本次经 fnm 安装的 Node 24.19.0 + corepack pnpm 11.20.0 执行构建；后续会话需同样显式加入 PATH 或先修复环境。

##### 下一步

- Deploy 双绿后浏览器验证艺术字、`<title>`、加载页与 PWA manifest 均为 "liremio の主页"。

#### 站名艺术字二次调整（liremio'，同日追补）

##### 摘要

用户看过线上效果后要求把艺术字 "liremio の主页" 改为 "liremio'"（延续 5.3.0 前 `li'remio` 的撇号品牌样式）。仅改 `VITE_SITE_LOGO_TEXT`；`VITE_SITE_NAME` 保持 "liremio の主页"（标签页 title/加载页/manifest 为完整站名，页面艺术字为短样式，与原项目「完整站名做标题、短艺术字上页面」模式一致）。`.env` 本地同步，未入库。

##### 涉及文件

- `.env.example`：`VITE_SITE_LOGO_TEXT` "liremio の主页" → "liremio'"。
- `docs/ai/STATUS.md`：本追补记录。源码零改动。

##### 验证

- `pnpm build`：通过（31.73s）。
- 产物核验：`dist/index-*.js` 含 "liremio'"；`dist/index.html` title 保持 "liremio の主页"。
- 提交推送触发 Deploy，线上待验证。

##### 风险与缺口

- "liremio'" 为 8 字符，仍触发 `.long` 缩字号样式（≥6 即触发），若希望恢复 5rem 大字需调整 `Message.vue` 的 `long` 阈值或样式。
- 标题是否同步改短未获用户明确指示，按「仅改艺术字」理解执行；如需 title 一并改短另行处理。

### 2026-09-13（第三场）

#### 线上验证闭环 + 三项冒烟 + Dockerfile 重写（ADR-0006）

##### 摘要

浏览器完成 9-13 艺术字线上验证与 9-09 依赖升级遗留的三项冒烟（壁纸切换/设置持久化/Links 轮播），全部通过；随后按路线图落地 Dockerfile 重写（ADR-0006）。源码零改动。

##### 冒烟结果与发现

- 艺术字：线上 bundle `index-De2AHlo-.js` 含 "liremio'"（Message/Right 两处），`<title>`/加载页/控制台输出为 "liremio の主页"；实测渲染 Pacifico 字体、计算字号 56px（桌面 `.long` 3.5rem 生效，8 字符触发阈值为预期行为）。
- 壁纸切换：radio → store.coverType → watch → img.src 链路正常，toast「壁纸更换成功」与 localStorage 持久化正确，已恢复默认值。发现：api.dujin.org 与 api.vvhan.com 两个外部壁纸源在本环境均无法出图（页面内 Image 探针 error，服务端问题），首次失败按设计回退本地图并提示；**Background.vue `@error.once` 只保护首次错误**——首次回退后监听器即移除，再次切到坏源时第二个 error 无处理、背景静默空白（既有边界缺陷，本次未修）。
- 设置持久化：siteStartShow 开 → localStorage `data.siteStartShow=true` → 刷新后 store 恢复（v-if 渲染生效）→ 时光胶囊建站日期条显示「本站已经苟活了 1 年 3 月 5 天」，persistedstate v4 `pick` 链路验证通过，已恢复默认 false。附带发现：TimeCapsule.vue `startDateText` 仅由 60s interval 首次赋值（onMounted 未先算一次），开关打开后文本最长延迟 60s 出现（既有小瑕疵，本次未修）。
- Links 轮播：swiper 12 初始化成功（`.swiper-initialized`），单 slide 含博客/图床/邮箱 3 卡、bullet 1 个，无异常（当前 siteLinks 仅 3 条，翻页无从触发属预期）。
- 其他：SW active(controller)、PWA「站点已更新」提示正常、一言 API 降级与恢复均实测、设置页版本号 v5.4.0 正确。

##### 涉及文件

- `Dockerfile`（重写：node:22-alpine + corepack pnpm 多阶段构建 + nginx:alpine 静态运行时，EXPOSE 80）
- `nginx.conf`（新增：gzip_static、/assets/ 长缓存、index.html/sw.js/manifest no-cache、try_files 兜底）
- `.dockerignore`（补 `.env` 硬排除与 `!.env.example`、docs/screenshots，清理过时条目）
- `docker-compose.yml`（端口 `12445:80`，移除废弃 version 字段）
- `README.md`（Docker 运行命令同步 `-p 12445:80`）
- `docs/ai/decisions/0006-dockerfile-rewrite.md`（新增 ADR）
- `CHANGELOG.md`（[Unreleased] 增补 Docker 小节）

##### 验证

- `pnpm lint:check` / `pnpm typecheck` / `pnpm test`（4 文件 20 用例）/ `pnpm build`：均 exit 0（precache 22 entries / 591.27 KiB）。
- `docker build`：本机无 Docker（command not found），未能构建验证。遗留：有 Docker 环境时执行 `docker build -t home . && docker run -p 12445:80 -d home` 后 curl 校验首页与静态资源。
- 冒烟过程备注：Playwright 语义定位对 el-radio/el-switch 点击不稳定（actionability 判定超时、无遮挡），改用坐标点击完成，不影响结论。

##### 风险与缺口

- Docker 镜像未实际构建运行，nginx.conf 未经运行时检验（已人工复核，构建中曾发现并修正 nginx.conf 误入 .dockerignore 的冲突）。
- 外部壁纸源不可用 + `@error.once` 缺陷组合：选「每日一图/随机风景/随机动漫」的用户可能遇到回退本地图（首次）或空白背景（同会话再次失败）。建议后续小修：`@error.once` → `@error`，并评估更换壁纸源。
- TimeCapsule 建站日期文本延迟 60s 小瑕疵待修（onMounted 先赋值一次即可）。
- build 输出 caniuse-lite 过期提醒，对应路线图小杂项（`npx update-browserslist-db@latest`）。

##### 下一步

- 有 Docker 环境时补镜像构建验证。
- 小修 PR：Background.vue `@error.once`、TimeCapsule 首次赋值时机。
- 功能项：设置页补全（樱花/动画开关、壁纸模糊度等）、更新日志自动读取 CHANGELOG。
