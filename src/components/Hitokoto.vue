<template>
  <div class="hitokoto cards" v-show="!store.musicOpenState" @click.stop>
    <!-- 打开音乐面板（hover 或焦点进入卡片即显形；opacity 方案保留可聚焦性） -->
    <button
      type="button"
      class="open-music"
      v-if="playerHasId"
      @click="store.musicOpenState = true"
    >
      <music-menu theme="filled" size="18" fill="#efefef" />
      <span>打开音乐播放器</span>
    </button>
    <!-- 一言内容（点击换一句） -->
    <Transition name="el-fade-in-linear" mode="out-in">
      <button
        :key="hitokotoData.text"
        type="button"
        class="content"
        aria-label="换一句话"
        @click="updateHitokoto"
      >
        <span class="text">{{ hitokotoData.text }}</span>
        <span class="from">-「&nbsp;{{ hitokotoData.from }}&nbsp;」</span>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { MusicMenu, Error } from "@icon-park/vue-next";
import { getHitokoto } from "@/api";
import { mainStore } from "@/store";
import debounce from "@/utils/debounce";

const store = mainStore();

// 是否配置了音乐（Player 懒加载后不再依赖 musicIsOk 判断入口显隐）
const playerHasId = !!import.meta.env.VITE_SONG_ID;

// 一言数据
const hitokotoData = reactive({
  text: "这里应该显示一句话",
  from: "未知",
});

// 请求令牌：防抖间隙外的慢响应可能后到，仅采纳最新一次请求的结果
let hitokotoToken = 0;

// 获取一言数据
const getHitokotoData = async () => {
  const token = ++hitokotoToken;
  try {
    const result = await getHitokoto();
    if (token !== hitokotoToken) return;
    hitokotoData.text = result.hitokoto;
    hitokotoData.from = result.from;
  } catch (error) {
    if (token !== hitokotoToken) return;
    ElMessage({
      message: "一言获取失败",
      icon: h(Error, {
        theme: "filled",
        fill: "#efefef",
      }),
    });
    hitokotoData.text = "这里应该显示一句话";
    hitokotoData.from = "未知";
  }
};

// 更新一言数据（防抖）
const updateHitokoto = debounce(() => {
  getHitokotoData();
}, 500);

onMounted(() => {
  getHitokotoData();
});
</script>

<style lang="scss" scoped>
.hitokoto {
  width: 100%;
  height: 100%;
  padding: 20px;
  animation: fade 0.5s;
  .open-music {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #00000026;
    padding: 4px 0;
    border-radius: 8px 8px 0 0;
    border: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    // 默认隐形但保留可聚焦性（opacity 方案），hover 或焦点进入卡片即显形
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    .i-icon {
      width: 18px;
      height: 18px;
      display: block;
      margin-right: 8px;
    }
    span {
      font-size: 0.95rem;
    }
  }
  &:hover .open-music,
  &:focus-within .open-music {
    opacity: 1;
    pointer-events: auto;
  }
  .content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    background: none;
    border: none;
    font: inherit;
    color: inherit;
    padding: 0;
    cursor: pointer;
    text-align: inherit;
    .text {
      font-size: 1.1rem;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .from {
      margin-top: 10px;
      font-weight: bold;
      align-self: flex-end;
      font-size: 1.1rem;
    }
  }
}
</style>
