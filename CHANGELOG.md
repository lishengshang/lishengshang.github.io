# 变更记录

本仓库基于 [imsyy/home](https://github.com/imsyy/home) fork 维护。版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 性能优化
- `global.scss` 纯 mixin 化：响应式布局样式移入 `style.scss` 全局单次发射（此前经 `additionalData` 注入每个 SFC 的 style 块，`max-width:1200px` 在产物中重复 25 处，治理后 4 处）；删除无消费者的 `.xs-hidden` 规则
- 压缩插件关闭 brotli 产物：nginx:alpine 无 brotli 模块、GitHub Pages 亦不消费，每次构建白产 17 个 `.br` 死产物
- 壁纸 `img` 增加 `fetchpriority="high"` 与 `decoding="async"`,壁纸 URL 提前至组件 setup 同步初始化,浏览器首帧即可发起壁纸请求(LCP 提前);字体 CDN 增加 preconnect 提前建连
- 本地字体 TTF → WOFF2(44.6 KB → 15.9 KB,-64%),`@font-face` 同步切换
- 运行时精简:歌单/时钟/时光胶囊数据改 `shallowRef`,永不变化的 env 配置去除响应式包装;resize 写入 store 与音量持久化增加防抖;Loading 动画完成后暂停三组无限旋转动画
- 页面动画关闭时波纹节点改为不生成并增加兜底移除(原先 `animationend` 不触发导致不可见节点随点击无限累积)
- PWA 运行时缓存(js/css 与图片)增加条目上限(`maxEntries: 60`)与配额告急自动清理

### 修复
- 修复底栏歌词永不显示：版权区 `v-once` 与 `v-if/v-else` 同用时，Vue 会把整个条件表达式连同分支一并缓存，首次渲染后条件永不再求值（播放态切换歌词与设置页歌词开关全部失效）；移除 `v-once` 并新增 Footer 组件测试 4 例（含「加回 v-once 必失败」的回归验证）
- 樱花组件在花瓣图加载完成前卸载不再泄漏动画循环：补卸载置位守卫（原先 `onload` 晚于卸载触发时，rAF 循环无任何取消路径，50 花瓣在脱离文档的 canvas 上永久空转）
- 搜索浮层外部引擎行纳入 ↑↓/回车键盘导航（原先引擎行独立渲染，键盘用户无法发起外部搜索），打开引擎后浮层同步关闭（与站内条目行为一致），新增回归测试
- 页脚备案号为空时备案段整体不渲染（原先渲染孤立的「&」）；补齐 3 处外链 `rel="noopener noreferrer"`（下载壁纸 / GitHub 主页 / 备案链接），与站内既有惯例对齐
- 时光胶囊建站日期按本地时区解析：裸 `new Date("YYYY-MM-DD")` 按 UTC 零点解析，UTC 减时区访问者的「苟活天数」统计差一天；仅年份格式按当年 1 月 1 日本地零点
- 壁纸加载完成定时器先清理旧实例再注册，消除快速连续触发时的覆盖竞态隐患
- QQ 音乐解析逐级判空：Meting 返回的 sip 空数组、midurlinfo 与歌单不等长、条目 url 缺失时不再抛无定位的 TypeError，改为带语义的错误信息（外层统一降级为用户提示）
- SW 运行时缓存补 `cacheableResponse`：js/css 仅缓存显式 200，图片放行跨域 opaque(status=0) 并排除错误状态，源站抖动期不再缓存失败响应
- 一言请求增加令牌防护:防抖间隙外的慢响应后到时不再覆盖新文本
- 播放器 author 前缀清理定时器在组件卸载时回收,不再触碰已卸载 DOM

### 工程
- CI 消除 push main 双构建:Build 检查改为仅 PR 触发,部署流水线前置 lint/test/typecheck 门禁(同一提交构建一次且门禁覆盖部署)
- Build 工作流补最小权限声明（`permissions: contents: read`）；`.env.example` 注明其为 CI 生产配置真源（`cp .env.example .env` 构建，本地 `.env` 与其漂移以本文件为准）
- `env.d.ts` 补全 ImportMetaEnv 全量声明（约 20 个 VITE_* 变量离开 any 兜底，拼写错误 typecheck 即暴露），Footer/Message 相应改为类型安全写法
- 运行时图标库（@icon-park/vue-next、@vicons/*）由 devDependencies 归位 dependencies（`--prod` 安装后可正常构建）
- CI Node 统一 22（与 Dockerfile node:22-alpine、engines >=22 对齐）；workflow job 补 `timeout-minutes: 15`；pnpm/action-setup 按 commit SHA 固定；dependabot 补 docker 生态并归并 minor/patch 更新
- vitest 配置补 Components 插件与主配置对齐（否则被测组件里的 el-* 以未知元素渲染，断言可能静默失真）
- `setPlayerState` 更名 `setPlayerPaused`（入参即 audio.paused，消除「传播放状态再内部取反」的语义陷阱）；删除 Friends 页 closeShow 死代码；`.env.example` 标注「音乐」条目与设置页开关的联动语义
- 文档与实现脱节清理：字体覆盖指引 ttf→woff2（两份 README + public/font/README）、Star History 徽章仓库名修正、README_EN API 列表对齐中文版、index.html 清理 rel=bookmark 误用与废弃的 apple-touch-icon-precomposed
- ESLint 全局变量改由 unplugin-auto-import 自动生成清单(`.eslintrc-auto-import.json` 入库)同步,移除手工维护与死配置(`$openList`/`vue`)
- `vite.config.ts` / `vitest.config.ts` 纳入 typecheck 范围
- 重复逻辑抽离:站点/友链图标映射统一到 `utils/linkIcons.ts`,艺术字文本并入 `useSiteUrl.logoText`;搜索浮层两分支模板合并(输出逐字节一致);合并重复的 `.cards` 样式定义并清理注释死样式
- v-for key 修正:网站列表改用索引/名称、时光胶囊改用标签名,消除 `as never` 断言;时光胶囊百分比改为数据源直接产出数值
- QQ 音乐链接解析增加格式守卫(畸形 URL 显式报错);花瓣图加载失败补日志
- nginx 增加 `X-Content-Type-Options` / `X-Frame-Options` / `Referrer-Policy` 安全响应头(仅 Docker 部署链路)
- 新增波纹指令单测 3 例(双守卫与兜底清理回归),测试 10 文件 39 用例

## [5.6.0] - 2026-10-01

### 新功能
- 设置页支持移动端：网站列表标题栏新增设置入口（⚙ 仅 <721px 显示，桌面端动线不变仍经盒子齿轮），窄屏不再强制关闭设置页，MoreSet 布局与 el-col xs 断点（<768px）对齐为单列堆叠并支持整体滚动
- 新增搜索聚合浮层（网站列表标题栏入口图标或 Ctrl/Cmd+K 唤起）：聚合站点链接、友链、站内功能（设置/友链页/音乐列表）与 Bing/Google/百度/GitHub 外部搜索，↑↓ 循环选择、回车打开选中项，Esc 关闭
- 新增友链页面：网站列表标题栏入口图标打开，`#/friends` hash 直达并支持浏览器前进后退（ADR-0007，未引入 vue-router）；友链数据在 `src/assets/friendLinks.json` 维护
- 友链页新增「提交 Issue 申请」入口，配套 `.github/ISSUE_TEMPLATE/friend-request.yml` 申请模板

### 设置页
- 「暗色模式」开关升级为「外观主题」三态选择（浅色 / 暗色 / 跟随系统，默认跟随 `prefers-color-scheme` 并实时响应系统变化），持久化且刷新首帧前挂类无闪白
- 界面玻璃表面令牌化（`--glass-panel`/`--surface-1..4`/`--popup-text*`）：暗色下设置面板、折叠面板、卡片、音乐列表与播放器弹层统一黑玻璃，弹层深色文字自动反转；引入 Element Plus 官方 `html.dark` 变量主题（+3.2 kB CSS），EP 组件随主题自适应；暗色下壁纸同步降亮（brightness 0.55）

### 修复
- 修复右键屏蔽不生效：`addEventListener` 监听器的返回值不取消默认行为，改为显式 `preventDefault()`，右键菜单现真正被拦截
- PWA 图片缓存正则补 `webp`：本地壁纸离线时不再 404（原先会触发「壁纸加载失败」误报 toast）
- 友链页面板背景接入 `--glass-panel` 令牌，暗色模式下与设置面板一致为黑玻璃
- 重复选择同一外部壁纸源（随机风景/动漫）时追加时间戳强制刷新，可获取新的随机图
- PWA 更新改 prompt 模式：新版本就绪时弹出可点击通知，用户确认后刷新，消除新旧构建交替期间懒加载 chunk 失败的竞态

### 工程
- 站点元信息（版本号/主页/仓库）改为构建期 `define` 注入（`import.meta.env.VITE_APP_*`），`package.json` 不再整包打入客户端 bundle；`github` 元信息同步修正为更名后的仓库地址
- 清理分支：删除 origin/dev（0 独有提交）、本地 4 条双会话备份分支与 2 条已合并分支，build.yml 移除 dev 触发器
- 外部壁纸源迁移到 `.env` 配置（`VITE_WALLPAPER_VIEWS` / `VITE_WALLPAPER_ACG`，留空走内置默认），接口失效时无需改代码
- 新增 TimeCapsule 组件测试（@vue/test-utils 首次投入使用），覆盖建站日期「挂载后立即可见」回归点

## [5.5.0] - 2026-09-16

### 依赖升级（5.4.0，ADR-0005）
- Vue 3.4 → 3.5.42、Pinia 2 → 3.0.4（persistedstate v4，`paths` → `pick`）、Vite 6 → 7.3.6（插件链配套升级）
- Element Plus 2.7 → **2.13.0**：实测 2.14.0 起按需导入的 tree-shaking 失效（产物 +730 KiB 全量打包），故锁定 2.13.0 待上游修复
- swiper 11 → 12.1.2（消除原型污染 critical）；nanoid override ≥3.3.18（pnpm 11 overrides 迁至 `pnpm-workspace.yaml`）
- `pnpm audit --prod`：15 个漏洞（1 critical）→ **0**
- caniuse-lite 更新；产物同拓扑重建，precache 552.93 → 590.46 KiB

### 工程化
- 引入 Vitest 5 + @vue/test-utils + jsdom，新增 `pnpm test` 与 utils/api/composables 共 20 个单测（覆盖防抖、时钟/时光胶囊/建站统计、音乐列表与一言 API 超时降级、站点链接 composable）
- CI（Build）新增 lint（无 `--fix`）与 unit test 门禁
- 新增 `pnpm lint:check` 脚本供 CI 校验使用

### 设置页
- 更新日志改为构建期读取 CHANGELOG（`?raw` 打包进产物），与变更记录保持同源，不再手动维护
- 新增「樱花飘落」「页面动画」开关与「壁纸模糊度」（0~40px）滑杆调节；「其他设置」新增「降低动态效果」主开关（同时关闭樱花、点击波纹、自定义光标与页面动画），全部本地持久化
- 自定义光标支持运行时销毁/重建；欢迎提示与默哀模式改由壁纸加载状态触发，不再依赖入场动画事件

### 修复
- 外部壁纸源更换：dujin 必应每日一图与 vvhan 两接口均已失效，「随机风景/随机动漫」改为 t.alcy.cc（实测可用），「每日一图」选项下线（旧持久化值按默认壁纸处理）
- 壁纸加载失败回退不再受 `@error.once` 单次限制，每次失败均回退本地图并提示
- 时光胶囊建站日期文本改为挂载后立即计算（原先最长延迟 60s 显示）

### Docker（ADR-0006）
- 重写 Dockerfile：Node 18 + npm + http-server → Node 22-alpine + corepack pnpm（锁文件生效）多阶段构建，运行时换 nginx:alpine 静态镜像（对外端口仍为 12445）
- 新增 nginx.conf：预压缩产物直出、`/assets/` 长缓存、`index.html`/`sw.js`/`manifest.webmanifest` 不缓存
- `.dockerignore` 排除 `.env` 与冗余目录，消除密钥进入 build context 的风险

## [5.3.0] - 2026-08-22

### 性能
- 音乐播放器懒加载：aplayer 懒加载 + 列表弹窗首次打开才挂载，fetch-jsonp 动态导入（首屏不再加载 aplayer chunk 与歌单 API）
- 构建产物 vendor 分包（element-plus / aplayer / vendor 独立 chunk），提升浏览器缓存复用
- 壁纸 JPEG → WebP（3.6MB → 1.2MB，-67%）
- HarmonyOS Sans 字体 CSS 改非阻塞加载（preload 方式，先以系统字体渲染）
- 站点总体积 dist 6.2MB → 3.5MB（-44%）

### 定制
- 新增 `VITE_SITE_LOGO_TEXT` 站名艺术字配置（默认 `li'remio`，留空回退域名第一段）
- 补全站名超长 `.long` 缩字号样式，去除域名后缀显示（桌面端与移动端一致）
- 控制台品牌与一言兜底文案去除原作者「無名」残留

### 修复与清理
- 删除未被引用的 `Pacifico-Regular-all.ttf`（315KB 死资产）
- Sakura `visibilitychange` 监听器卸载时移除（内存泄漏）
- 移除 cursor.ts 死代码（`refresh()` / `mainCursor`）

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
