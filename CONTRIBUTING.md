# 贡献指南

请先阅读 [`AGENTS.md`](./AGENTS.md) 和 [`docs/ai/README.md`](./docs/ai/README.md)。本项目接受人工和 AI Agent 协作提交，所有提交都必须遵守同一套规则。

## 提交前

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm lint
pnpm build
```

修改环境变量时只更新 `.env.example`，不要提交 `.env`。修改用户可见行为、配置项、部署流程或架构时，同时更新 README、架构文档或 ADR。

## Pull Request

PR 应说明目标、影响范围、复用或新增依赖的理由、验证命令及结果、已知风险和后续事项。避免将重构、功能、依赖升级和无关格式化混在同一个 PR 中。
