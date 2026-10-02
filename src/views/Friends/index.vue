<template>
  <div class="friends">
    <div class="panel">
      <div class="head">
        <div class="title">
          <Icon size="20">
            <UserFriends />
          </Icon>
          <span>友链</span>
        </div>
        <close-one
          class="close"
          theme="filled"
          size="28"
          fill="#ffffff60"
          @mouseenter="closeShow = true"
          @mouseleave="closeShow = false"
          @click="store.friendsOpenState = false"
        />
      </div>
      <el-row class="list" :gutter="20">
        <el-col
          v-for="(friend, index) in friendLinks"
          :key="friend.link"
          :span="8"
          :md="8"
          :sm="12"
          :xs="24"
        >
          <div
            class="item cards enter"
            :style="{ '--enter-delay': `${0.1 + index * 0.06}s` }"
            v-ripple
            @click="openFriend(friend)"
          >
            <Icon size="26">
              <component :is="friendIcon[friend.icon] ?? Compass" />
            </Icon>
            <div class="meta">
              <span class="name text-hidden">{{ friend.name }}</span>
              <span class="desc text-hidden">{{ friend.desc }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-if="!friendLinks[0]" class="empty cards">暂无友链，欢迎通过 Github 交换友链</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import {
  Compass,
  UserFriends,
  Blog,
  Cloud,
  CompactDisc,
  Book,
  Fire,
  LaptopCode,
  Image,
  Envelope,
} from "@vicons/fa";
import { CloseOne } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import friendLinks from "@/assets/friendLinks.json";
import type { Component } from "vue";

const store = mainStore();
const closeShow = ref(false);

type FriendLink = (typeof friendLinks)[number];

// 友链图标（与 siteLinks 共用 xicons 图标集，未识别时回退指南针）
const friendIcon: Record<string, Component> = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  Book,
  Fire,
  LaptopCode,
  Image,
  Envelope,
  UserFriends,
};

// 打开友链
const openFriend = (friend: FriendLink): void => {
  window.open(friend.link, "_blank", "noopener,noreferrer");
};
</script>

<style lang="scss" scoped>
.friends {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: #00000070;
  backdrop-filter: blur(20px);
  animation: fade 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;

  .panel {
    width: 80%;
    height: 80%;
    padding: 40px;
    border-radius: 6px;
    background: var(--glass-panel);
    position: relative;

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;

      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 20px;
        font-weight: bold;
        text-shadow: 0 0 5px #00000050;

        .i-icon {
          display: flex;
        }
      }

      .close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 28px;
        height: 28px;
        cursor: pointer;
        transition:
          transform 0.3s,
          opacity 0.3s;

        &:hover {
          transform: scale(1.2);
        }
      }
    }

    .list {
      .item {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        margin-bottom: 20px;
        cursor: pointer;

        .i-icon {
          display: flex;
          flex-shrink: 0;
        }

        .meta {
          margin-left: 14px;
          min-width: 0;
          display: flex;
          flex-direction: column;

          .name {
            font-size: 15px;
            font-weight: bold;
          }

          .desc {
            margin-top: 4px;
            font-size: 12px;
            opacity: 0.7;
          }
        }
      }
    }

    .empty {
      padding: 40px;
      text-align: center;
      font-size: 14px;
      opacity: 0.8;
    }

    @media (max-width: 825px) {
      padding: 20px;
    }
  }

  @media (max-width: 990px) {
    .panel {
      width: 92%;
      height: 88%;
    }
  }
}
</style>
