export type ChangelogEntries = {
  new: string[];
  fix: string[];
};

// 剥离行内 Markdown 标记（**加粗**、`代码`），供纯文本展示
const inline = (line: string): string =>
  line
    .replace(/^-\s+/, "")
    .replace(/`/g, "")
    .replace(/\*\*/g, "")
    .trim();

// 解析 CHANGELOG.md 原文供设置页展示：
// 取 [Unreleased] 段（为空或无条目时回退最近一个版本段），按 "### " 小节归类——
// 标题含「修复」的小节归 fix，其余小节与裸条目归 new，各列表最多保留 limit 条
export const parseChangelog = (raw: string, limit = 6): ChangelogEntries => {
  const entries: ChangelogEntries = { new: [], fix: [] };
  const hasItems = (section: string): boolean => /^-\s/m.test(section);
  const sections = raw.split(/^##\s+/m).slice(1);
  const unreleased = sections.find((s) => s.startsWith("[Unreleased]"));
  const section =
    unreleased && hasItems(unreleased)
      ? unreleased
      : (sections.find((s) => /^\[v?\d+\.\d/.test(s) && hasItems(s)) ?? "");
  if (!section) return entries;
  // "### " 小节之前的裸条目一律归入 new
  const [intro, ...subsections] = section.split(/^###\s+/m);
  for (const line of intro.split("\n")) {
    if (/^-\s/.test(line)) entries.new.push(inline(line));
  }
  for (const sub of subsections) {
    const [title, ...lines] = sub.split("\n");
    const bucket = title.includes("修复") ? entries.fix : entries.new;
    for (const line of lines) {
      if (/^-\s/.test(line)) bucket.push(inline(line));
    }
  }
  entries.new = entries.new.slice(0, limit);
  entries.fix = entries.fix.slice(0, limit);
  return entries;
};
