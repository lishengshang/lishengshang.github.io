# AI Agent 协作规范

本目录是仓库级、可版本控制的协作规范。它解决多个 Agent 轮流工作时的上下文丢失、重复造轮子、未经验证提交和文档漂移问题。

## 文件职责

- `AGENTS.md`：所有 Agent 的短入口和不可省略的工作规则。
- `agent-spec.yaml`：机器可读的项目事实、目录边界、命令和质量门槛。
- `architecture.md`：人和 Agent 都能快速理解的架构边界。
- `workflow.md`：从需求到交接的标准流程和风险分级。
- STATUS.md：多 Agent 协作唯一实时进度文件，开工前必读、交接后必更新。
- `decisions/`：长期有效的架构、依赖和兼容性决策记录（ADR）。
- `templates/`：变更计划、ADR、交接和 PR 模板。

## 规则

1. 规范本身也要走 PR、经过 review，并在 `agent-spec.yaml` 的 `schema_version` 发生不兼容变化时升级版本。
2. 项目事实只维护一份；平台专属文件只能链接到 `AGENTS.md`，不能复制规则。
3. Agent 不得宣称“已测试”而没有命令和结果；无法执行时要写明原因。
4. 发现现有代码问题但不属于当前目标时，记录为后续事项，不扩大当前变更范围。

## 平台入口

- OpenCode / 通用 Agent：`AGENTS.md`
- Cursor：`.cursor/rules/project.mdc`
- GitHub Copilot：`.github/copilot-instructions.md`
- Claude Code：`CLAUDE.md`
