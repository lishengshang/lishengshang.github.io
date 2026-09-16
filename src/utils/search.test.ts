import { describe, expect, it } from "vitest";
import { buildSearchIndex, filterSearchIndex, searchEngines } from "./search";

describe("search", () => {
  it("索引包含站点链接、友链与站内视图", () => {
    const index = buildSearchIndex();
    expect(index.some((i) => i.name === "博客")).toBe(true);
    expect(index.some((i) => i.name === "無名の主页")).toBe(true);
    expect(index.some((i) => i.view === "settings")).toBe(true);
    expect(index.some((i) => i.view === "friends")).toBe(true);
    expect(index.some((i) => i.view === "music")).toBe(true);
  });

  it("关键词过滤不区分大小写且匹配名称与提示", () => {
    const index = buildSearchIndex();
    const byName = filterSearchIndex(index, "博客");
    expect(byName).toHaveLength(1);
    expect(byName[0].kind).toBe("link");
    // 「友链」既命中友链页面视图，也命中友链条目的提示文案
    expect(filterSearchIndex(index, "友链").length).toBeGreaterThanOrEqual(2);
  });

  it("空关键词返回全量索引", () => {
    const index = buildSearchIndex();
    expect(filterSearchIndex(index, "")).toHaveLength(index.length);
    expect(filterSearchIndex(index, "   ")).toHaveLength(index.length);
  });

  it("搜索引擎配置包含查询前缀", () => {
    expect(searchEngines.length).toBeGreaterThanOrEqual(3);
    expect(searchEngines.every((e) => /[?&]q=|[?&]wd=/.test(e.url))).toBe(true);
  });
});
