# ADR-0001：CI 重写

- 状态：accepted
- 日期：2026-08-07
- 影响范围：`.github/workflows`、`package.json`、构建工具链

## 背景

本项目 fork 自已停止维护的 `imsyy/home`。上游旧 CI 参考 `d8e3bd8`，使用 `windows-latest`、Node 18 和 `npm install`/`npm run build`，依赖 `secrets.ACCESS_TOKEN`，仅在 `dev` 和 `master` 分支运行，用于“Dev 分支部署预览”。该流程没有使用 pnpm，也没有拉取请求检查。fork 后需要重建为通用的构建检查流程。

相关提交如下：

- `73dab32`（2026-08-07）：建立 CI 骨架，使用 Ubuntu、Node 20 和 pnpm，新增 `main` 分支与 `pull_request` 触发，启用并发取消，使用 `pnpm install --frozen-lockfile`，仅在推送时上传构建产物；同时新增 `packageManager`、Node 版本约束、Dependabot 和 pnpm 工作区配置，并删除 `axios` 依赖。
- `06e155c`（2026-08-07）：删除工作流中硬编码的 pnpm 版本，改由 `packageManager` 字段单一管理；Node 20 升级为 24，`engines` 升级为 `>=22`。
- `4f416e8`（2026-08-07）：将构建链从 Vite 4 升级到 Vite 5，更新相关插件和压缩插件，修复 Sass modern API 下 `additionalData` 的解析路径，并删除无效的 `silenceDeprecations` 配置。

## 选项

1. 沿用上游的 Windows、Node 18 和 npm 方案。否决，因为它依赖 npm 时代的产物，无法锁定包管理器版本，也没有拉取请求检查。
2. 使用 pnpm、Ubuntu 和固定版本的 Node。曾采用该方向，但 `06e155c` 发现 CI 与本地版本存在冲突，需要进一步统一版本来源。
3. 使用 `packageManager` 字段单一锁定 pnpm 版本，并采用 CI Node 24 与 `engines >=22`。采用。

## 决策

采用方案 3。将包管理器锁定为 `pnpm@11.20.0`，版本来源统一为 `package.json` 的 `packageManager` 字段。CI 使用 `ubuntu-latest` 和 Node 24，在 `main`、`dev` 推送及拉取请求时执行构建，启用并发取消，使用 `pnpm install --frozen-lockfile`，仅在推送时上传构建产物。

## 后果

构建链升级到 Vite 5、Rollup 4、workbox 7 和 `vite-plugin-compression2`，同时删除无效配置。Dependabot 持续追踪依赖和 Actions 版本。构建检查覆盖拉取请求，构建资源只在推送时上传。

## 回滚或迁移方案

各相关提交可以独立使用 `git revert` 回滚。需要整体恢复上游旧流程时，可参考 `d8e3bd8` 恢复旧工作流。
