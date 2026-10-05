<template>
  <footer id="footer" :class="store.footerBlur ? 'blur' : null">
    <Transition name="fade" mode="out-in">
      <!-- 注意：此处不可加 v-once——v-once 会把整个 v-if/v-else 条件表达式连同分支一并缓存，
           首次渲染后条件永不再求值，播放态切换歌词的功能会整体失效 -->
      <div v-if="!store.playerState || !store.playerLrcShow" class="power">
        <span>
          <span :class="showStartYear ? 'c-hidden' : 'hidden'">Copyright&nbsp;</span>
          &copy;
          <span v-if="showStartYear"
            class="site-start">
            {{ startYear }}
            -
          </span>
          {{ fullYear }}
          <a :href="siteUrl">{{ siteAuthor }}</a>
        </span>
        <!-- 当前维护者署名 -->
        <span class="hidden">
          &amp;&nbsp;Made&nbsp;by
          <a href="https://github.com/lishengshang" target="_blank" rel="noopener noreferrer">
            {{ siteAuthor }}
          </a>
        </span>
        <!-- 站点备案（无备案号时整段不渲染，避免底栏出现孤立的「&」） -->
        <span v-if="siteIcp">
          &amp;
          <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
            {{ siteIcp }}
          </a>
        </span>
      </div>
      <div v-else class="lrc">
        <Transition name="fade" mode="out-in">
          <div class="lrc-all" :key="store.playerLrc">
            <music-one theme="filled" size="18" fill="#efefef" />
            <span class="lrc-text text-hidden">{{ store.playerLrc }}</span>
            <music-one theme="filled" size="18" fill="#efefef" />
          </div>
        </Transition>
      </div>
    </Transition>
    <!-- 歌曲进度条（点击跳转） -->
    <div
      v-if="store.playerDuration > 0"
      class="progress"
      @click="onProgressSeek"
      @mousemove="onProgressHover"
      @mouseleave="hoverTime = null"
    >
      <div class="progress-played" :style="{ width: `${progressPercent}%` }" />
      <span v-if="hoverTime !== null" class="progress-tip" :style="{ left: `${hoverLeft}px` }">
        {{ formatTime(hoverTime) }}
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { MusicOne } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import { useSiteUrl } from "@/composables/useSiteUrl";

const store = mainStore();
const fullYear = new Date().getFullYear();

// 建站年份（"YYYY-MM-DD" 取前 4 位或裸 "YYYY"），未配置时为空串
const siteStart = import.meta.env.VITE_SITE_START ?? "";
const startYear = siteStart.length >= 4 ? siteStart.slice(0, 4) : "";
const showStartYear = /^\d{4}$/.test(startYear) && Number(startYear) < fullYear;
const siteIcp = import.meta.env.VITE_SITE_ICP;
const siteAuthor = import.meta.env.VITE_SITE_AUTHOR;
const { siteUrlFull: siteUrl } = useSiteUrl();

// 歌曲进度条
const progressPercent = computed(() =>
  store.playerDuration > 0 ? (store.playerTime / store.playerDuration) * 100 : 0,
);
const hoverTime = ref<number | null>(null);
const hoverLeft = ref(0);

// 时间格式化（mm:ss）
const formatTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
};

// 进度条 hover：显示对应位置的时间气泡
const onProgressHover = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  hoverTime.value = Math.min(Math.max(ratio, 0), 1) * store.playerDuration;
  // 限制气泡不超出进度条两端
  hoverLeft.value = Math.min(Math.max(e.clientX - rect.left, 32), rect.width - 32);
};

// 点击进度条跳转
const onProgressSeek = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  store.requestPlayerSeek(ratio * store.playerDuration);
};
</script>

<style lang="scss" scoped>
#footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 46px;
  line-height: 46px;
  text-align: center;
  z-index: 0;
  font-size: 14px;
  // 文字不换行
  word-break: keep-all;
  white-space: nowrap;
  .power {
    animation: fade 0.3s;
  }
  .lrc {
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .lrc-all {
      width: 98%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .lrc-text {
        margin: 0 8px;
      }
      .i-icon {
        width: 18px;
        height: 18px;
        display: inherit;
      }
    }
  }
  &.blur {
    backdrop-filter: blur(10px);
    background: rgb(0 0 0 / 25%);
    font-size: 16px;
  }
  // 歌曲进度条（贴底细线，hover 增高，点击跳转）
  .progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgb(255 255 255 / 20%);
    cursor: pointer;
    transition: height 0.2s;
    z-index: 1;
    &:hover {
      height: 6px;
    }
    .progress-played {
      height: 100%;
      background: #efefef;
    }
    .progress-tip {
      position: absolute;
      bottom: 14px;
      transform: translateX(-50%);
      padding: 3px 8px;
      border-radius: 4px;
      background: rgb(0 0 0 / 50%);
      backdrop-filter: blur(10px);
      font-size: 12px;
      line-height: 1;
      color: #efefef;
      pointer-events: none;
      white-space: nowrap;
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease-in-out;
  }
  @media (max-width: 720px) {
    font-size: 0.9rem;
    &.blur {
      font-size: 0.9rem;
    }
  }
  @media (max-width: 560px) {
    .c-hidden {
      display: none;
    }
  }
  @media (max-width: 480px) {
    .hidden {
      display: none;
    }
  }
}
</style>
