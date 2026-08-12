# AI Agent 协作入口

本文件是所有 AI Agent 在本仓库工作的统一入口。OpenCode、Cursor、Copilot、Claude Code 及其他工具均应优先读取本文件，并继续读取 `docs/ai/agent-spec.yaml` 与 `docs/ai/README.md`。

## 必须遵守

1. 修改前先阅读相关源码、配置、README 和近期提交；不得凭假设重构。
2. 保持变更小而完整：一个变更只解决一个问题，不顺手格式化无关文件。
3. 优先复用当前技术栈和成熟、活跃维护的开源方案；引入依赖前说明用途、维护状态、许可证、体积和替代方案。
4. 不提交密钥、`.env`、生成目录、个人配置或未授权的外部服务配置。
5. 修改行为时同步更新测试、文档、环境变量示例和相关 CI；如果无法补齐，必须明确记录风险。
6. 不删除或覆盖其他协作者已有的未提交改动；发现冲突时停下并报告。
7. 完成前运行适用的验证命令，并在交接或 PR 中报告命令、结果和未验证项。

## 项目基线

- Node.js：`>=22`
- 包管理器：`pnpm`，版本以 `package.json` 的 `packageManager` 为准
- 安装：`pnpm install --frozen-lockfile`
- 格式化：`pnpm format`
- 静态检查：`pnpm lint`
- 构建：先复制 `.env.example` 为 `.env`，再运行 `pnpm build`

## 工作流程

1. 明确目标、范围、非目标和验收标准；复杂变更先使用 `docs/ai/templates/change-plan.md`。
2. 检索现有实现和可复用方案，确认影响面：`src/`、配置、资源、文档、CI、部署。
3. 实施最小可审查变更；架构或依赖取舍写入 `docs/ai/decisions/`。
4. 运行验证并检查 `git diff`；不把临时文件、构建产物或 `.env` 纳入变更。
5. 按 `docs/ai/templates/handoff.md` 输出交接信息。

## 权威规则

发生冲突时，优先级为：用户明确要求 > 本文件 > `docs/ai/agent-spec.yaml` > `docs/ai/README.md` > 平台专属指针文件。平台文件只负责指向本入口，不得复制出另一套规则。
