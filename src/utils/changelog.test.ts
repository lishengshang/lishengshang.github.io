import { describe, expect, it } from "vitest";
import { parseChangelog } from "./changelog";

const sample = `# 变更记录

## [Unreleased]

### 新功能
- **樱花开关** 新增设置项
- 支持 \`?raw\` 导入

### 修复
- 修复壁纸回退失效

## [1.0.0] - 2026-01-01

### 修复
- 修复初始版本问题
- 修复另一个问题
`;

describe("parseChangelog", () => {
  it("按小节归类 new/fix 并剥离行内标记", () => {
    const result = parseChangelog(sample);
    expect(result.new).toEqual(["樱花开关 新增设置项", "支持 ?raw 导入"]);
    expect(result.fix).toEqual(["修复壁纸回退失效"]);
  });

  it("Unreleased 段无条目时回退最近的版本段", () => {
    const raw = sample.replace(
      "## [Unreleased]\n\n### 新功能\n- **樱花开关** 新增设置项\n- 支持 `?raw` 导入\n\n### 修复\n- 修复壁纸回退失效\n",
      "## [Unreleased]\n",
    );
    const result = parseChangelog(raw);
    expect(result.fix).toEqual(["修复初始版本问题", "修复另一个问题"]);
    expect(result.new).toEqual([]);
  });

  it("限制各列表最多 limit 条", () => {
    const raw = sample.replace(
      "- 修复壁纸回退失效",
      ["一", "二", "三", "四", "五", "六", "七"].map((n) => `- 修复问题${n}`).join("\n"),
    );
    const result = parseChangelog(raw, 6);
    expect(result.fix).toHaveLength(6);
    expect(result.fix[0]).toBe("修复问题一");
  });

  it("空输入返回空列表", () => {
    expect(parseChangelog("")).toEqual({ new: [], fix: [] });
  });
});
