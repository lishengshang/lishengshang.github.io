import { describe, it, expect, vi, afterEach } from "vitest";
import { useSiteUrl } from "./useSiteUrl";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("useSiteUrl", () => {
  it("未配置时使用默认域名", () => {
    vi.stubEnv("VITE_SITE_URL", "");

    const { siteUrl, siteUrlFull } = useSiteUrl();
    expect(siteUrl.value).toEqual(["lishengshang", "github", "io"]);
    expect(siteUrlFull.value).toBe("https://lishengshang.github.io");
  });

  it("带协议的完整 URL：去除协议后分割，跳转保留完整链接", () => {
    vi.stubEnv("VITE_SITE_URL", "https://www.example.com");

    const { siteUrl, siteUrlFull } = useSiteUrl();
    expect(siteUrl.value).toEqual(["www", "example", "com"]);
    expect(siteUrlFull.value).toBe("https://www.example.com");
  });

  it("不带协议时：分割域名，跳转链接补 // 前缀", () => {
    vi.stubEnv("VITE_SITE_URL", "example.com");

    const { siteUrl, siteUrlFull } = useSiteUrl();
    expect(siteUrl.value).toEqual(["example", "com"]);
    expect(siteUrlFull.value).toBe("//example.com");
  });
});
