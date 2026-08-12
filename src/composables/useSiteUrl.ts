// 站点链接 composable
// siteUrl: 分割数组（用于显示站点名）
// siteUrlFull: 完整链接（带协议，用于跳转）
export const useSiteUrl = () => {
  const siteUrl = computed(() => {
    const url = import.meta.env.VITE_SITE_URL;
    if (!url) return "lishengshang.github.io".split(".");
    // 判断协议前缀
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const urlFormat = url.replace(/^(https?:\/\/)/, "");
      return urlFormat.split(".");
    }
    return url.split(".");
  });

  const siteUrlFull = computed(() => {
    const url = import.meta.env.VITE_SITE_URL;
    if (!url) return "https://lishengshang.github.io";
    // 判断协议前缀
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "//" + url;
    }
    return url;
  });

  return { siteUrl, siteUrlFull };
};
