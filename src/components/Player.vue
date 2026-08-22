<template>
  <APlayer
    v-if="playList[0]"
    ref="player"
    :audio="playList"
    :autoplay="store.playerAutoplay"
    :theme="theme"
    :autoSwitch="false"
    :loop="store.playerLoop"
    :order="store.playerOrder"
    :volume="volume"
    :listFolded="listFolded"
    :listMaxHeight="listMaxHeight"
    :noticeSwitch="false"
    @play="onPlay"
    @pause="onPause"
    @timeupdate="onTimeUp"
    @error="loadMusicError"
  />
</template>

<script setup lang="ts">
import { MusicOne, PlayWrong } from "@icon-park/vue-next";
import { getPlayerList } from "@/api";
import type { PlayerItem } from "@/api";
import { mainStore } from "@/store";

// 懒加载 aplayer，减小首屏体积（首次打开音乐列表时才加载）
const APlayer = defineAsyncComponent(() => import("@worstone/vue-aplayer"));

const store = mainStore();

interface APlayerInstance {
  readonly aplayer: {
    readonly index: number;
    readonly lyrics: Array<Array<[number, string]>>;
    readonly lyricIndex: number;
    readonly audio: PlayerItem[];
  };
  readonly audioRef: HTMLAudioElement;
  toggle(): void;
  // eslint-disable-next-line no-unused-vars -- Parameter labels document the APlayer instance contract.
  setVolume(value: number, isUserAction?: boolean): void;
  skipBack(): void;
  skipForward(): void;
  play(): void;
}

// 获取播放器 DOM
const player = ref<APlayerInstance | null>(null);

// 歌曲播放列表
const playList = ref<PlayerItem[]>([]);

// 歌曲播放项
const playIndex = ref(0);

// 配置项
const props = defineProps({
  // 主题色
  theme: {
    type: String,
    default: "#efefef",
  },
  // 默认音量
  volume: {
    type: Number,
    default: 0.7,
    validator: (value: number): boolean => {
      return value >= 0 && value <= 1;
    },
  },
  // 歌曲服务器 ( netease-网易云, tencent-qq音乐 )
  songServer: {
    type: String,
    default: "netease", //'netease' | 'tencent'
  },
  // 播放类型 ( song-歌曲, playlist-播放列表, album-专辑, search-搜索, artist-艺术家 )
  songType: {
    type: String,
    default: "playlist",
  },
  // id
  songId: {
    type: String,
    default: "7452421335",
  },
  // 列表展开状态（注意：该库语义相反，listFolded=true 才表示列表展开显示）
  listFolded: {
    type: Boolean,
    default: true,
  },
  // 列表最大高度
  listMaxHeight: {
    type: Number,
    default: 420,
  },
});

const listHeight = computed(() => {
  return props.listMaxHeight + "px";
});

// 初始化播放器
onMounted(() => {
  nextTick(async () => {
    try {
      const res = await getPlayerList(props.songServer, props.songType, props.songId);
      // 更改播放器加载状态
      store.musicIsOk = true;
      // 生成歌单
      playList.value = res;
      // 初始渲染后清理 author 行的 " - " 前缀（未自动播放时不会触发 onPlay）
      setTimeout(stripAuthorDash, 50);
    } catch (err) {
      console.error(err);
      store.musicIsOk = false;
      ElMessage({
        message: "播放器加载失败",
        grouping: true,
        icon: h(PlayWrong, {
          theme: "filled",
          fill: "#efefef",
        }),
      });
    }
  });
});

// APlayer 默认把 author 元素内容前缀写成 " - "，歌名/歌手分行时需去掉
const stripAuthorDash = () => {
  const root = player.value as unknown as { $el?: Element } | undefined | null;
  const el = root?.$el?.querySelector?.(".aplayer-author") as HTMLElement | null;
  if (!el) return;
  const t = el.textContent;
  if (t && t.trim().startsWith("- ")) {
    el.textContent = t.trim().replace(/^-\s*/, "");
  }
};

// 播放
const onPlay = () => {
  const playerInstance = player.value!;
  playIndex.value = playerInstance.aplayer.index;
  // 播放状态
  store.setPlayerState(playerInstance.audioRef.paused);
  // 储存播放器信息
  store.setPlayerData(playList.value[playIndex.value].name, playList.value[playIndex.value].artist);
  ElMessage({
    message: store.playerTitle + " - " + store.playerArtist,
    grouping: true,
    icon: h(MusicOne, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  nextTick(stripAuthorDash);
};

// 暂停
const onPause = () => {
  store.setPlayerState(player.value!.audioRef.paused);
};

// 音频时间更新事件
const onTimeUp = () => {
  const playerInstance = player.value!;
  // 更新播放进度（供底栏进度条显示）
  store.setPlayerProgress(
    playerInstance.audioRef.currentTime,
    playerInstance.audioRef.duration || 0,
  );
  const lyrics = playerInstance.aplayer.lyrics[playIndex.value];
  const lyricIndex = playerInstance.aplayer.lyricIndex;
  if (!lyrics || !lyrics[lyricIndex]) {
    return;
  }
  let lrc = lyrics[lyricIndex][1];
  if (lrc === "Loading") {
    lrc = "歌词加载中";
  } else if (lrc === "Not available") {
    lrc = "歌词加载失败";
  }
  store.setPlayerLrc(lrc);
};

// 切换播放暂停事件
const playToggle = () => {
  player.value!.toggle();
};

// 切换音量事件
const changeVolume = (value: number) => {
  player.value!.setVolume(value, false);
};

// 切换上下曲
const changeSong = (type: number) => {
  type === 0 ? player.value!.skipBack() : player.value!.skipForward();
  nextTick(() => {
    player.value!.play();
  });
};

// 响应底栏进度条跳转请求
watch(
  () => store.playerSeekTo,
  (value) => {
    if (value === null || !player.value) return;
    player.value.audioRef.currentTime = value;
    store.playerSeekTo = null;
  },
);

// 加载音频错误
const loadMusicError = () => {
  const playerInstance = player.value!;
  let notice = "";
  if (playList.value.length > 1) {
    notice = "播放歌曲出现错误，播放器将在 2s 后进行下一首";
  } else {
    notice = "播放歌曲出现错误";
  }
  ElMessage({
    message: notice,
    grouping: true,
    icon: h(PlayWrong, {
      theme: "filled",
      fill: "#EFEFEF",
      duration: 2000,
    }),
  });
  console.error(
    "播放歌曲: " +
      playerInstance.aplayer.audio[playerInstance.aplayer.index].name +
      " 出现错误",
  );
};

// 暴露子组件方法
defineExpose({ playToggle, changeVolume, changeSong });
</script>

<style lang="scss" scoped>
.aplayer {
  width: 92%;
  height: 100%;
  border-radius: 6px;
  font-family: "HarmonyOS_Regular", sans-serif !important;
  background-color: transparent !important;
  :deep(.aplayer-body) {
    background-color: transparent;
    margin: 14px 14px 10px;
    // 封面：正常显示 72x72 圆角方形 + 阴影，贴合弹窗白模糊风格
    .aplayer-pic {
      display: block;
      width: 72px;
      height: 72px;
      border-radius: 8px;
      margin: 0;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgb(0 0 0 / 18%);
    }
    .aplayer-info {
      margin-left: 14px;
      background-color: transparent;
      border-color: transparent !important;
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      min-width: 0;
      .aplayer-music {
        flex-direction: column;
        align-items: flex-start;
        height: auto;
        margin: 0;
        overflow: initial;
        clear: none;
        flex: none;
        .aplayer-title {
          display: block;
          font-size: 17px;
          font-weight: 500;
          color: #1a1a1a;
          margin: 0 0 4px;
          max-width: 100%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .aplayer-author {
          display: block;
          color: #555;
          font-size: 13px;
          max-width: 100%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      // 歌词：底栏已有，弹窗内不重复显示
      .aplayer-lrc {
        display: none !important;
      }
      // 控制条（进度+按钮）：右栏有自定义按钮 + 底栏有进度条，不重复
      .aplayer-controller {
        display: none !important;
      }
    }
  }
  // 歌单列表：加大边距与项间距，提高可读性
  :deep(.aplayer-list) {
    margin: 0 14px 14px;
    height: v-bind(listHeight);
    background-color: transparent;
    border-radius: 6px;
    ol {
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
      li {
        border-color: transparent;
        padding: 8px 10px;
        margin: 2px 0;
        border-radius: 6px;
        .aplayer-list-cur {
          opacity: 0;
        }
        &.aplayer-list-light {
          background: #ffffff55;
          .aplayer-list-cur {
            opacity: 1;
          }
        }
        &:hover {
          background: #ffffff33 !important;
        }
        .aplayer-list-index,
        .aplayer-list-author {
          color: #444;
        }
        .aplayer-list-title {
          color: #1a1a1a;
        }
      }
    }
  }
}
</style>
