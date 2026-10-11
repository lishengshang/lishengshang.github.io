<template>
  <div v-if="siteLinks[0]" class="links">
    <div class="line">
      <Icon size="20">
        <Link />
      </Icon>
      <span class="title">网站列表</span>
      <div class="actions">
        <el-tooltip content="设置" placement="top" :show-arrow="false">
          <button
            type="button"
            class="entry setting-entry"
            aria-label="设置"
            aria-haspopup="dialog"
            @click="store.setOpenState = true"
          >
            <Icon size="18">
              <Cog />
            </Icon>
          </button>
        </el-tooltip>
        <el-tooltip content="搜索（Ctrl+K）" placement="top" :show-arrow="false">
          <button
            type="button"
            class="entry"
            aria-label="搜索"
            aria-haspopup="dialog"
            @click="store.searchOpenState = true"
          >
            <Icon size="18">
              <Search />
            </Icon>
          </button>
        </el-tooltip>
        <el-tooltip content="友链页面" placement="top" :show-arrow="false">
          <button
            type="button"
            class="entry"
            aria-label="友链页面"
            aria-haspopup="dialog"
            @click="store.friendsOpenState = true"
          >
            <Icon size="18">
              <UserFriends />
            </Icon>
          </button>
        </el-tooltip>
      </div>
    </div>
    <!-- 网站列表 -->
    <Swiper
      v-if="siteLinks[0]"
      :modules="SWIPER_MODULES"
      :slides-per-view="1"
      :space-between="40"
      :pagination="SWIPER_PAGINATION"
      :mousewheel="true"
    >
      <SwiperSlide v-for="(site, idx) in siteLinksList" :key="idx">
        <el-row class="link-all" :gutter="20">
          <el-col v-for="(item, index) in site" :span="8" :key="item.name">
            <!-- 站点本质是外链，用原生 a 承载（中键/新标签/Echo 均为浏览器原生行为） -->
            <a
              class="item cards enter"
              :style="[index < 3 ? 'margin-bottom: 20px' : null, { '--enter-delay': `${0.4 + index * 0.05}s` }]"
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
              v-ripple
              @click="jumpLink($event, item)"
            >
              <Icon size="26">
                <component :is="linkIcons[item.icon]" />
              </Icon>
              <span class="name text-hidden">{{ item.name }}</span>
            </a>
          </el-col>
        </el-row>
      </SwiperSlide>
      <div class="swiper-pagination" />
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
// 标题栏与模板内直接使用的图标；站点卡片图标经 utils/linkIcons 统一映射
import { Link, UserFriends, Search, Cog } from "@vicons/fa";
import { mainStore } from "@/store";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Mousewheel } from "swiper/modules";
import "swiper/css";
import siteLinks from "@/assets/siteLinks.json";
import { linkIcons } from "@/utils/linkIcons";

const store = mainStore();
type SiteLink = (typeof siteLinks)[number];

// Swiper 配置常量：避免每次渲染生成新引用触发组件多余更新
const SWIPER_MODULES = [Pagination, Mousewheel];
const SWIPER_PAGINATION = {
  el: ".swiper-pagination",
  clickable: true,
  bulletElement: "div",
};

// 计算网站链接
const siteLinksList = computed<SiteLink[][]>(() => {
  const result: SiteLink[][] = [];
  for (let i = 0; i < siteLinks.length; i += 6) {
    const subArr = siteLinks.slice(i, i + 6);
    result.push(subArr);
  }
  return result;
});

// 链接跳转：默认交给 a 原生行为；音乐卡片在开启 musicClick 时拦下面板打开
const jumpLink = (event: MouseEvent, data: SiteLink): void => {
  if (data.name === "音乐" && store.musicClick) {
    event.preventDefault();
    store.openMusicList();
  }
};
</script>

<style lang="scss" scoped>
.links {
  .line {
    margin: 2rem 0.25rem 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    animation: fade 0.5s;
    .title {
      margin-left: 8px;
      font-size: 1.15rem;
      text-shadow: 0 0 5px #00000050;
    }
    .actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 12px;
      .entry {
        display: flex;
        align-items: center;
        background: none;
        border: none;
        padding: 0;
        color: inherit;
        cursor: pointer;
        opacity: 0.85;
        transition: transform 0.3s;

        &:hover {
          transform: scale(1.2);
          opacity: 1;
        }
      }

      // 设置入口仅移动端显示（桌面端经盒子齿轮进入，保持原动线）
      .setting-entry {
        @media (min-width: 721px) {
          display: none;
        }
      }
    }
  }
  .swiper {
    left: -10px;
    width: calc(100% + 20px);
    padding: 5px 10px 0;
    z-index: 0;
    .swiper-slide {
      height: 100%;
    }
    .swiper-pagination {
      margin-top: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      :deep(.swiper-pagination-bullet) {
        background-color: #fff;
        width: 20px;
        height: 4px;
        margin: 0 4px;
        border-radius: 4px;
        opacity: 0.2;
        transition: opacity 0.3s;
        &.swiper-pagination-bullet-active {
          opacity: 1;
        }
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .link-all {
    height: 220px;
    .item {
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      padding: 0 10px;
      animation: fade 0.5s;

      // 抵消全局 a:hover 的变色与下划线（卡片本身有 hover 浮起反馈）
      &:hover {
        color: #fff;
        text-decoration: none;
        transform: scale(1.02);
        background: rgb(0 0 0 / 40%);
        transition: 0.3s;
      }

      &:active {
        transform: scale(1);
      }

      .name {
        font-size: 1.1rem;
        margin-left: 8px;
      }
      @media (min-width: 720px) and (max-width: 820px) {
        .name {
          display: none;
        }
      }
      @media (max-width: 720px) {
        height: 80px;
      }
      @media (max-width: 460px) {
        flex-direction: column;
        .name {
          font-size: 1rem;
          margin-left: 0;
          margin-top: 8px;
        }
      }
    }
    @media (max-width: 720px) {
      height: 180px;
    }
  }
}
</style>
