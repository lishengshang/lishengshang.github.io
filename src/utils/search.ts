import siteLinks from "@/assets/siteLinks.json";
import friendLinks from "@/assets/friendLinks.json";

export type SearchItem = {
  name: string;
  tip: string;
  kind: "link" | "view";
  url?: string;
  view?: "friends" | "settings" | "music";
};

export type SearchEngine = {
  name: string;
  url: string;
};

// 外部搜索引擎（跳转时拼接 encodeURIComponent 后的关键词）
export const searchEngines: SearchEngine[] = [
  { name: "Bing", url: "https://www.bing.com/search?q=" },
  { name: "Google", url: "https://www.google.com/search?q=" },
  { name: "百度", url: "https://www.baidu.com/s?wd=" },
  { name: "GitHub", url: "https://github.com/search?q=" },
];

// 站内聚合索引：站点链接 + 友链 + 站内功能视图
export const buildSearchIndex = (): SearchItem[] => {
  const items: SearchItem[] = [];
  for (const site of siteLinks) {
    items.push({ name: site.name, tip: "站点链接", kind: "link", url: site.link });
  }
  for (const friend of friendLinks) {
    items.push({ name: friend.name, tip: `友链 · ${friend.desc}`, kind: "link", url: friend.link });
  }
  items.push({ name: "友链页面", tip: "站内页面", kind: "view", view: "friends" });
  items.push({ name: "全局设置", tip: "站内功能", kind: "view", view: "settings" });
  items.push({ name: "音乐列表", tip: "站内功能", kind: "view", view: "music" });
  return items;
};

// 关键词过滤：名称或提示包含关键词（不区分大小写），空关键词返回全量
export const filterSearchIndex = (items: SearchItem[], keyword: string): SearchItem[] => {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return items;
  return items.filter(
    (item) => item.name.toLowerCase().includes(kw) || item.tip.toLowerCase().includes(kw),
  );
};
