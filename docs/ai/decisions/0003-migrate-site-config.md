# ADR-0003：站点配置迁移到项目自有配置

- 状态：accepted
- 日期：2026-08-09
- 影响范围：`src/assets/siteLinks.json`、`src/assets/socialLinks.json`、`src/composables/useSiteUrl.js`、`.env.example`、`.github/workflows/dispatch.yml`

## 背景

fork 后，原配置仍全部指向原作者 imsyy 的域名和账号，包括 7 条站内链接、6 条社交链接，以及 `imsyy.top` 兜底域名。项目需要替换为 lishengshang 的自有值，并将个性化配置收敛为项目内可维护的配置契约。

相关提交如下：

- `fc6163c`：将 `siteLinks.json` 从 7 条缩减为 1 条 Blog 链接 `https://lishengshang.github.io/blog/`，将 `socialLinks.json` 从 6 条缩减为 1 条 Github 链接 `https://github.com/lishengshang`。
- `e0cbd45`：将 `useSiteUrl.js` 的兜底域名从 `imsyy.top` 改为 `lishengshang.github.io`。
- `a69bd5a`：替换 `.env.example` 中的 `VITE_SITE_NAME`、`VITE_AUTHOR`、`VITE_KEYWORDS`、`VITE_URL`、`VITE_START` 五个值，并新增 `dispatch.yml`，在推送到 `main` 时使用 `actions/github-script@v7` 向 `lishengshang/lishengshang.github.io` 发送 `sync` 事件，令部署仓库使用 `secrets.PUBLISH_TOKEN` 触发同步。
- `57d9a77`：补充维护和部署架构说明。前置提交 `73dab32` 新建 `useSiteUrl.js`，集中四处重复的 `siteUrl` computed。

根据 `architecture.md` 第 9 至 10 行，个性化配置优先放在 `.env`、`src/assets/siteLinks.json` 和 `src/assets/socialLinks.json`，`.env.example` 是环境变量契约。

## 选项

1. 保留原作者配置，只修改部分值。否决，因为域名和账号仍可能指向他人。
2. 全部替换为自有配置，并建立部署自动同步链路。采用。

## 决策

采用方案 2。将链接数据、域名兜底和站点信息全部改为项目自有配置，新增推送到 `main` 后触发的 `dispatch` 自动部署链路，并将配置契约收敛为 `.env`、`siteLinks.json` 和 `socialLinks.json`。

源仓库负责构建，并通过 `dispatch` 事件将构建同步到部署仓库 `lishengshang.github.io`，由部署仓库自行构建和部署，实现推送后自动上线。fork 用户必须删除 `dispatch.yml`，因为它依赖作者仓库的 `PUBLISH_TOKEN`，README 已提供警告。

## 后果

推送后可自动触发部署，无需手动操作。fork 用户需要自行删除 `dispatch.yml`，并修改 `.env` 与两个 JSON 配置文件。项目不再依赖原作者的域名与 CDN 引用。

## 回滚或迁移方案

恢复原作者配置时，可参考 `fc6163c^` 和 `e0cbd45^`。需要停止自动部署时，删除 `.github/workflows/dispatch.yml` 即可。
