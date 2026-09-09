# ADR-0005：依赖大版本升级（Vue 3.5 / Pinia 3 / Vite 7 / Element Plus 2.13）

- 状态：accepted
- 日期：2026-09-09
- 影响范围：`package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、`src/store/index.ts`、构建产物

## 背景

2026-08-13 评审发现 `pnpm audit --prod` 报告 15 个漏洞（1 critical / 6 high / 8 moderate），主要来自 swiper 原型污染（critical）、element-plus 依赖链上的 lodash/vue-demi/compiler-sfc 链上的 postcss/nanoid 等。核心依赖停留在 Vue 3.4 / Pinia 2 / Element Plus 2.7 / Vite 6，属路线图「依赖升级」项。

## 选项

1. 维持现状，仅打 override 消漏洞。否决，核心框架停更风险持续累积。
2. 全部升至各依赖最新大版本（含 Element Plus 2.14+）。部分否决，见下方发现。
3. Vue 3.5 / Pinia 3 / Vite 7 / Element Plus 2.13 / swiper 12，nanoid 用 override 强制 ≥3.3.18。采用。

## 决策

采用方案 3，版本矩阵：

| 依赖 | 升级前 | 升级后 | 说明 |
|---|---|---|---|
| vue | 3.4.24 | 3.5.42 | 路线图目标 |
| pinia | 2.1.7 | 3.0.4 | 暂不升 4（刚发布，生态未稳） |
| pinia-plugin-persistedstate | 3.2.1 | 4.7.1 | v4 将 `paths` 选项改名 `pick`，`src/store/index.ts` 同步修改 |
| element-plus | 2.7.1 | **2.13.0（锁定）** | 见下方发现 |
| swiper | 11.1.1 | 12.1.2 | 消除原型污染 critical 的最小修复版本 |
| vite | 6.4.3 | 7.3.6 | 未采用 rolldown-vite（实验性，插件兼容风险，待其稳定再评估） |
| @vitejs/plugin-vue | 5.2.1 | 6.0.8 | 配套 Vite 7 |
| vite-plugin-compression2 | 1.3.3 | 2.5.3 | 配套 |
| unplugin-auto-import / vue-components | 0.17.8 / 0.27.4 | 21.1.0 / 32.1.0 | 已验证与现配置兼容 |
| nanoid | 3.3.17（传递依赖） | 3.3.18（override 强制） | `pnpm-workspace.yaml` overrides（pnpm 11 从 workspace yaml 读取，package.json `pnpm.overrides` 不再生效） |

### 关键发现：Element Plus 2.14.0 起 tree-shaking 失效

升级过程中实测（同配置下仅改 EP 版本，precache 体积）：

- 2.11.4 → 580.09 KiB；2.12.0 → 587.59 KiB；2.13.0 → 589.07 KiB
- **2.14.0 → 1304.74 KiB；2.14.5 → 1321.89 KiB（约 +730 KiB，全量打包）**

表现：未使用的组件（ElCascader/ElCarousel/ElTransfer 等）全部进入产物。EP 的按需方案（ElementPlusResolver）历来的运行时导入都走 `element-plus/es` barrel，依赖 Rollup tree-shaking 收敛；2.14.0 起该摇树在 barrel 导入下失效（对比 2.13/2.14 的 package.json sideEffects 声明一致，怀疑为内部模块结构或副作用变化，未深究根因）。已用最新 unplugin 与旧版 unplugin 双向复测，结果一致，排除插件侧原因。

因此**锁定 element-plus 2.13.0**，待上游修复后再跟进升级。

## 后果

- `pnpm audit --prod`：15 漏洞（1 critical）→ **0**。
- 产物对比（与升级前基线，按文件名+哈希）：44 个文件字节级一致；9 个 JS/CSS chunk 同拓扑重建（chunk 数量与类型不变）；`index.html`/`sw.js` 因引用更新变化。precache 552.93 → 590.46 KiB（+37.5 KiB，主要为 EP 2.7→2.13 与 vueuse 10→14 的正常增长）。
- 20 个单测、lint、typecheck、build 全部通过。
- 行为影响：persist 持久化字段不变（仅配置键名 `paths`→`pick`）；swiper 12 仅用于 Links 页轮播（Pagination/Mousewheel），API 兼容。

## 回滚或迁移方案

整个升级在 `feat/dep-upgrade` 分支上独立提交，回滚 git revert 即可；EP 若需单独跟进 2.14+，先验证 barrel 摇树恢复（对比 precache 体积应回到 ~590 KiB 水位）。
