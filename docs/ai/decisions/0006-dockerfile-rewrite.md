# ADR-0006：重写 Dockerfile（Node 22 + pnpm 多阶段构建 + nginx 静态镜像）

- 状态：accepted
- 日期：2026-09-13
- 影响范围：`Dockerfile`、`nginx.conf`（新增）、`.dockerignore`、`docker-compose.yml`、`README.md`

## 背景

2026-08-13 评审将「重写 Dockerfile」列为跟进项：原 Dockerfile 使用 `node:18` + `npm install`，与项目基线（Node >=22 + pnpm，版本以 `package.json` 的 `packageManager` 为准）冲突；`COPY package*.json` 不识别 `pnpm-lock.yaml`，依赖解析不受锁文件约束；运行时用 `http-server`（Node 进程常驻提供静态服务，镜像内仍带完整 Node 运行时）；`.dockerignore` 未排除 `.env`（本地密钥文件会进入 build context，且原构建脚本 `[ ! -e ".env" ]` 会优先使用它）；另含 `build`/`images`/`script` 三个不存在的过时条目。

## 选项

1. 维持 Node 18 + npm，仅改版本号。否决，锁文件依旧不生效，与基线冲突未消除。
2. Node 22 + pnpm 构建，运行时仍用 Node + http-server。否决，运行时无需 JS 运行时，白白增加镜像体积。
3. Node 22-alpine + corepack pnpm 多阶段构建，运行时换 nginx:alpine。采用。
4. 运行时换 caddy:alpine。备选，自动 HTTPS 与配置更简，但本镜像面向本地/内网静态托管，nginx 更通用且引入的缓存控制（`gzip_static`、按路径 Cache-Control）在 nginx 上表达更直接。

## 决策

- **构建阶段**：`node:22-alpine` + `corepack enable`，pnpm 版本由 `packageManager` 字段钉住（pnpm@11.20.0，corepack 校验其哈希）；`pnpm install --frozen-lockfile`；先拷 `package.json`/`pnpm-lock.yaml`/`pnpm-workspace.yaml` 再拷源码，保证依赖层缓存；`cp .env.example .env && pnpm build`，与 CI（build.yml/deploy.yml）口径一致。
- **运行阶段**：`nginx:alpine`，仅拷入 `dist` 与一份最小 `nginx.conf`；`EXPOSE 80`。
- **nginx.conf**：`gzip_static on` 直接利用 vite-plugin-compression2 产出的预压缩文件；`/assets/`（带内容哈希）长缓存 `immutable`；`index.html`、`sw.js`、`manifest.webmanifest` 设 `no-cache` 保证 PWA 更新即时生效；`try_files` 兜底到 `index.html`。
- **端口约定**：容器内统一 80；`docker-compose.yml` 与 README 以 `12445:80` 映射，保留原对外端口习惯。
- **`.dockerignore`**：补 `.env`（`!.env.example` 保留样例）与 `docs`/`screenshots`；移除不存在的过时条目。

依赖与许可说明：`node:22-alpine`、`nginx:alpine` 均为 Docker Hub 官方镜像（活跃维护）；nginx 以 BSD-2-Clause 授权，镜像体积约为原方案（Node 运行时 + http-server）的 1/4。

## 后果

- 锁文件成为 Docker 构建的唯一依赖解析来源，与本地/CI 行为一致。
- 镜像不含 Node 运行时，攻击面与体积显著缩小。
- `.env` 不再可能泄漏进镜像（.dockerignore 硬排除，构建脚本只用 `.env.example`）。
- PWA 产物获得正确的缓存策略（此前 http-server 无缓存控制）。
- 限制：GitHub Pages 部署链路（deploy.yml）不经过 Docker，本镜像仅供本地/自托管场景；Docker 构建未纳入 CI 门禁。

## 回滚或迁移方案

单提交变更，`git revert` 即可回到原 Dockerfile；`nginx.conf` 为新增文件，回滚后删除。
