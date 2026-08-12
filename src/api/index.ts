import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 默认歌曲 API 地址（未配置 VITE_SONG_API 时使用，建议自行部署 Meting-API）
const SONG_API = import.meta.env.VITE_SONG_API || "https://api.injahow.cn/meting/";

interface PlayerApiItem {
  readonly name: string;
  readonly title: string;
  readonly artist: string;
  readonly author: string;
  readonly url: string;
  readonly cover: string;
  readonly pic: string;
  readonly lrc: string;
}

interface JsonpPlayerResponse {
  readonly req_0: {
    readonly data: {
      readonly sip: string[];
      readonly midurlinfo: Array<{
        readonly purl: string;
      }>;
    };
  };
}

export interface PlayerItem {
  readonly name: string;
  readonly artist: string;
  readonly url: string;
  readonly cover: string;
  readonly lrc: string;
}

export interface HitokotoResponse {
  readonly hitokoto: string;
  readonly from: string;
}

// 获取音乐播放列表
export const getPlayerList = async (
  server: string,
  type: string,
  id: string,
): Promise<PlayerItem[]> => {
  const res = await fetch(`${SONG_API}?server=${server}&type=${type}&id=${id}`);
  if (!res.ok) throw new Error("音乐播放列表获取失败");
  const data: PlayerApiItem[] = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("音乐播放列表为空，请检查 VITE_SONG_API 配置");
  }

  if (data[0].url.startsWith("@")) {
    const [, , , url] = data[0].url.split("@").slice(1);
    const jsonpData: JsonpPlayerResponse = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i): PlayerItem => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: domain + jsonpData.req_0.data.midurlinfo[i].purl,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  } else {
    return data.map((v): PlayerItem => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: v.url,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async (): Promise<HitokotoResponse> => {
  const res = await fetch("https://v1.hitokoto.cn");
  if (!res.ok) throw new Error("一言获取失败");
  return await res.json();
};
