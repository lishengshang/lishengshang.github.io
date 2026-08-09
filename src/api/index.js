import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 默认歌曲 API 地址（未配置 VITE_SONG_API 时使用，建议自行部署 Meting-API）
const SONG_API = import.meta.env.VITE_SONG_API || "https://api.injahow.cn/meting/";

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  const res = await fetch(`${SONG_API}?server=${server}&type=${type}&id=${id}`);
  if (!res.ok) throw new Error("音乐播放列表获取失败");
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("音乐播放列表为空，请检查 VITE_SONG_API 配置");
  }

  if (data[0].url.startsWith("@")) {
    // eslint-disable-next-line no-unused-vars
    const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: domain + jsonpData.req_0.data.midurlinfo[i].purl,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  } else {
    return data.map((v) => ({
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
export const getHitokoto = async () => {
  const res = await fetch("https://v1.hitokoto.cn");
  if (!res.ok) throw new Error("一言获取失败");
  return await res.json();
};
