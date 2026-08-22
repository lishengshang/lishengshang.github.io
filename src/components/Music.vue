<template>
  <!-- 音乐控制面板 -->
  <div
    class="music"
    @mouseenter="volumeShow = true"
    @mouseleave="volumeShow = false"
    v-show="store.musicOpenState"
  >
    <div class="btns">
      <span @click="openMusicList()">音乐列表</span>
      <span @click="store.musicOpenState = false">回到一言</span>
    </div>
    <div class="control">
      <go-start theme="filled" size="30" fill="#efefef" @click="changeMusicIndex(0)" />
      <Transition name="fade" mode="out-in">
        <div :key="store.playerState as never" class="state" @click="changePlayState">
          <play-one theme="filled" size="50" fill="#efefef" v-show="!store.playerState" />
          <pause theme="filled" size="50" fill="#efefef" v-show="store.playerState" />
        </div>
      </Transition>
      <go-end theme="filled" size="30" fill="#efefef" @click="changeMusicIndex(1)" />
    </div>
    <div class="menu">
      <div class="name" v-show="!volumeShow">
        <span>{{
          store.playerTitle
            ? store.playerTitle + " - " + store.playerArtist
            : "未播放音乐"
        }}</span>
      </div>
      <div class="volume" v-show="volumeShow">
        <div class="icon">
          <volume-mute theme="filled" size="24" fill="#efefef" v-if="volumeNum == 0" />
          <volume-small
            theme="filled"
            size="24"
            fill="#efefef"
            v-else-if="volumeNum > 0 && volumeNum < 0.7"
          />
          <volume-notice theme="filled" size="24" fill="#efefef" v-else />
        </div>
        <el-slider v-model="volumeNum" :show-tooltip="false" :min="0" :max="1" :step="0.01" />
      </div>
    </div>
  </div>
  <!-- 音乐列表弹窗（首次打开才挂载 Player，懒加载 aplayer；之后保持挂载避免重复请求歌单） -->
  <Transition name="fade" mode="out-in">
    <div class="music-list" v-if="listMounted" v-show="musicListShow" @click="closeMusicList()">
      <Transition name="zoom">
        <div class="list" v-show="musicListShow" @click.stop>
          <close-one
            class="close"
            theme="filled"
            size="28"
            fill="#ffffff60"
            @click="closeMusicList()"
          />
          <Player
            ref="playerRef"
            :songServer="playerData.server"
            :songType="playerData.type"
            :songId="playerData.id"
            :volume="volumeNum"
          />
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  GoStart,
  PlayOne,
  Pause,
  GoEnd,
  CloseOne,
  VolumeMute,
  VolumeSmall,
  VolumeNotice,
} from "@icon-park/vue-next";
import Player from "@/components/Player.vue";
import { mainStore } from "@/store";
const store = mainStore();
type PlayerInstance = InstanceType<typeof Player>;

// 音量条数据
const volumeShow = ref(false);
const volumeNum = ref(store.musicVolume ? store.musicVolume : 0.7);

// 播放列表数据
const musicListShow = ref(false);
const listMounted = ref(false);
const playerRef = ref<PlayerInstance | null>(null);
const playerData = reactive({
  server: import.meta.env.VITE_SONG_SERVER,
  type: import.meta.env.VITE_SONG_TYPE,
  id: import.meta.env.VITE_SONG_ID,
});

// 开启播放列表
const openMusicList = () => {
  musicListShow.value = true;
  // 首次打开挂载 Player（触发 aplayer 异步 chunk 与歌单请求），此后保持挂载
  listMounted.value = true;
};

// 关闭播放列表
const closeMusicList = () => {
  musicListShow.value = false;
};

// 监听外部打开音乐列表请求（替代全局 window.$openList）
watch(
  () => store.musicListOpenState,
  (value) => {
    if (value) {
      openMusicList();
      store.musicListOpenState = false;
    }
  },
);

// 音乐播放暂停
const changePlayState = () => {
  playerRef.value?.playToggle();
};

// 音乐上下曲
const changeMusicIndex = (type: number) => {
  playerRef.value?.changeSong(type);
};

// 键盘事件：空格播放/暂停，ESC 关闭音乐列表弹窗
const onKeyDown = (e: KeyboardEvent) => {
  if (e.code === "Escape" && musicListShow.value) {
    closeMusicList();
    e.preventDefault();
    return;
  }
  if (!store.musicIsOk) {
    return;
  }
  if (e.code === "Space") {
    changePlayState();
  }
};

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown);
});

// 监听音量变化
watch(
  () => volumeNum.value,
  (value) => {
    store.musicVolume = value;
    playerRef.value?.changeVolume(store.musicVolume);
  },
);
</script>

<style lang="scss" scoped>
.music {
  width: 100%;
  height: 100%;
  background: #00000040;
  backdrop-filter: blur(10px);
  border-radius: 6px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  animation: fade 0.5s;
  .btns {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    span {
      background: #ffffff26;
      padding: 2px 8px;
      border-radius: 6px;
      margin: 0px 6px;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
      &:hover {
        background: #ffffff4d;
      }
    }
  }
  .control {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    .state {
      transition: opacity 0.1s;
      .i-icon {
        width: 50px;
        height: 50px;
        display: block;
      }
    }
    .i-icon {
      width: 36px;
      height: 36px;
      display: flex;
      border-radius: 6px;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transform: scale(1);
      &:hover {
        background: #ffffff33;
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }
  .menu {
    height: 26px;
    width: 100%;
    line-height: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .name {
      width: 100%;
      text-align: center;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
      animation: fade 0.3s;
    }
    .volume {
      width: 100%;
      padding: 0 12px;
      display: flex;
      align-items: center;
      flex-direction: row;
      animation: fade 0.3s;
      .icon {
        margin-right: 12px;
        span {
          width: 24px;
          height: 24px;
          display: block;
        }
      }
      // 音量滑块：与底栏进度条风格统一——细线、白色，去掉按钮和 Element Plus 原生蓝主题
      :deep(.el-slider) {
        margin-right: 12px;
        --el-slider-main-bg-color: #efefef;
        --el-slider-runway-bg-color: rgba(255, 255, 255, 0.2);
        --el-slider-button-size: 0px;
        --el-slider-button-border: none;
        --el-slider-button-bg-color: transparent;
        --el-slider-button-hover-bg-color: transparent;
        --el-slider-button-hover-border-color: transparent;
        --el-slider-button-drag-bg-color: transparent;
        --el-slider-height: 3px;
        --el-slider-runway-height: 3px;
        // hover 时增粗，与底栏进度条呼应
        &:hover {
          --el-slider-height: 6px;
          --el-slider-runway-height: 6px;
        }
      }
      :deep(.el-slider__runway) {
        border-radius: 2px;
      }
      :deep(.el-slider__bar) {
        border-radius: 2px;
      }
      :deep(.el-slider__button-wrapper) {
        display: none;
      }
      :deep(.el-slider__stop) {
        display: none;
      }
    }
  }
}
.music-list {
  position: fixed;
  top: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  backdrop-filter: blur(20px);
  z-index: 1;
  .list {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 640px;
    max-width: 90%;
    height: 600px;
    max-height: 90vh;
    padding: 56px 16px 16px;
    box-sizing: border-box;
    background-color: #ffffff66;
    border-radius: 8px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    @media (max-width: 720px) {
      padding: 52px 12px 12px;
    }
    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: transparent;
      transition: background 0.2s, transform 0.2s;
      z-index: 10;
      :deep(.i-icon) {
        width: 22px;
        height: 22px;
      }
      &:hover {
        background: #00000018;
        transform: scale(1.1);
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }
}

// 遮罩层淡入淡出
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 弹窗卡片：中心微缩 + 微移的自然过渡
.zoom-enter-active {
  transition:
    opacity 240ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}
.zoom-leave-active {
  transition:
    opacity 160ms cubic-bezier(0.4, 0, 1, 1),
    transform 160ms cubic-bezier(0.4, 0, 1, 1);
}
.zoom-enter-from {
  opacity: 0;
  transform: translate(-50%, calc(-50% + 12px)) scale(0.96);
}
.zoom-enter-to {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.zoom-leave-from {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.zoom-leave-to {
  opacity: 0;
  transform: translate(-50%, calc(-50% + 6px)) scale(0.98);
}
</style>
