# ADR-0004：仓库更名为 lishengshang.github.io 并合并部署链路

- 状态：accepted
- 日期：2026-09-03
- 影响范围：`.github/workflows/deploy.yml`（新增）、`.github/workflows/dispatch.yml`（删除）、`README.md`、`README_EN.md`、GitHub 仓库设置（更名与 Pages）

## 背景

ADR-0003 建立的两段式部署链路为：`homepage` 仓库 push 到 main 后，由 `dispatch.yml` 向站点仓库 `lishengshang.github.io` 发送 `repository_dispatch` 事件（依赖 `PUBLISH_TOKEN` secret），站点仓库再检出源仓库代码构建并部署 Pages。

该链路存在维护成本：跨两个仓库排查日志、维护跨仓库 token、`dispatch.yml` 与站点仓库 workflow 中的构建步骤重复维护，且 fork 用户必须手动删除 `dispatch.yml`。

GitHub Pages 用户站点域名（`lishengshang.github.io`）归属于名为 `lishengshang.github.io` 的仓库。将本仓库更名为该名字并启用 Pages（build_type: workflow），即可在本仓库内直接完成构建部署，站点 URL 不变。

## 选项

1. 维持两仓库 dispatch 链路。否决，维护成本高且 fork 用户需要额外清理。
2. 保留两仓库，改用 GitHub Actions 的 `workflow_call` 或 artifact 传递。否决，仍需跨仓库配置。
3. 本仓库更名为 `lishengshang.github.io`，原站点仓库自动改名为 `lishengshang.github.io-old` 并归档，部署收敛为本仓库内的 `deploy.yml`。采用。

## 决策

采用方案 3：

- 新增 `.github/workflows/deploy.yml`：push 到 main 触发，本仓库内完成 `pnpm build` 并通过 `actions/deploy-pages@v5` 部署。
- 删除 `.github/workflows/dispatch.yml` 及对 `PUBLISH_TOKEN` 的依赖。
- 通过 GitHub API 依次执行：旧站点仓库改名 `lishengshang.github.io-old` → 本仓库改名 `lishengshang.github.io` → 新仓库启用 Pages（workflow 模式）→ 推送 main 触发首次部署。
- README 中英版本的架构说明与 fork 警告同步更新：fork 用户不再需要删除任何文件。

## 后果

- 部署链路从"通知 + 跨仓库构建"收敛为单仓库单 workflow，日志集中，无跨仓库 secret。
- fork 用户开箱即用，README 移除删除 `dispatch.yml` 的警告。
- 旧站点仓库 `lishengshang.github.io-old` 保留历史但不再触发任何部署，观察期后可归档或删除。
- 本地与协作方的 remote URL 需更新一次（GitHub 会对旧 URL 做重定向，但不依赖重定向）。

## 回滚或迁移方案

如需回滚：将本仓库改回原名，把 `lishengshang.github.io-old` 改回原名并重新启用其 Pages，恢复 `dispatch.yml`（参考 git 历史中本 ADR 之前的提交）。站点在切换间隙可能短暂不可用，重新部署后自动恢复。
