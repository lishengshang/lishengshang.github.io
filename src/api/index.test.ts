import { describe, it, expect, vi, afterEach } from "vitest";
import { getPlayerList, getHitokoto } from "./index";

// 构造播放列表 API 返回项（name/title、artist/author、cover/pic 为互备字段）
const apiItem = (overrides: Partial<Record<string, string>> = {}) => ({
  name: "song",
  title: "song title",
  artist: "artist",
  author: "author A",
  url: "https://example.com/a.mp3",
  cover: "cover.jpg",
  pic: "pic.jpg",
  lrc: "[00:00]x",
  ...overrides,
});

const jsonResponse = (data: unknown, ok = true) => ({
  ok,
  json: async () => data,
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe("getPlayerList", () => {
  it("按 server/type/id 拼接请求并映射字段", async () => {
    const fetchMock = vi.fn(async () => jsonResponse([apiItem()]));
    vi.stubGlobal("fetch", fetchMock);

    const list = await getPlayerList("netease", "song", "123");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("?server=netease&type=song&id=123"),
      expect.objectContaining({ signal: expect.anything() }),
    );
    expect(list).toEqual([
      {
        name: "song",
        artist: "artist",
        url: "https://example.com/a.mp3",
        cover: "cover.jpg",
        lrc: "[00:00]x",
      },
    ]);
  });

  it("name/artist 缺失时回退 title/author", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse([apiItem({ name: "", artist: "", title: "标题", author: "作者" })]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const [item] = await getPlayerList("netease", "song", "123");
    expect(item.name).toBe("标题");
    expect(item.artist).toBe("作者");
  });

  it("响应非 2xx 时抛出错误", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse([], false)));

    await expect(getPlayerList("netease", "song", "123")).rejects.toThrow("音乐播放列表获取失败");
  });

  it("列表为空时抛出错误", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse([])));

    await expect(getPlayerList("netease", "song", "123")).rejects.toThrow("音乐播放列表为空");
  });

  it("可使用 VITE_SONG_API 覆盖默认接口地址", async () => {
    vi.stubEnv("VITE_SONG_API", "https://test.api/meting/");
    const fetchMock = vi.fn(async () => jsonResponse([apiItem()]));
    vi.stubGlobal("fetch", fetchMock);

    // SONG_API 为模块加载时常量，需重置模块缓存后动态导入以读取新环境变量
    vi.resetModules();
    const { getPlayerList: getPlayerListWithEnv } = await import("./index");
    await getPlayerListWithEnv("netease", "song", "123");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/test\.api\/meting\/\?server=/),
      expect.anything(),
    );
  });

  it("超时降级：默认 5s 后中止请求", async () => {
    vi.useFakeTimers();
    // fetch 模拟：监听 abort 信号后才 reject，模拟真实请求悬挂
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init?: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
      ),
    );

    const pending = getPlayerList("netease", "song", "123");
    const assertion = expect(pending).rejects.toThrow();
    await vi.advanceTimersByTimeAsync(5000);
    await assertion;
  });
});

describe("getHitokoto", () => {
  it("返回一言数据", async () => {
    const data = { hitokoto: "一言内容", from: "出处" };
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse(data)));

    await expect(getHitokoto()).resolves.toEqual(data);
  });

  it("响应非 2xx 时抛出错误", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({}, false)));

    await expect(getHitokoto()).rejects.toThrow("一言获取失败");
  });
});
