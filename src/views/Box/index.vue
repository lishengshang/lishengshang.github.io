<template>
  <div id="box" class="box cards">
    <!-- 关闭/设置按钮常驻可聚焦（opacity 显隐，键盘 Tab 进入盒子即显形） -->
    <button type="button" class="close" aria-label="关闭盒子" @click="store.boxOpenState = false">
      <close-one theme="filled" size="28" fill="#ffffff60" />
    </button>
    <button type="button" class="setting" aria-label="打开设置" @click="store.setOpenState = true">
      <setting-two theme="filled" size="28" fill="#ffffff60" />
    </button>
    <div class="content">
      <!-- 可在此处自定义任意内容 -->
      <TimeCapsule />
      <MoreContent />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CloseOne, SettingTwo } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import TimeCapsule from "@/components/TimeCapsule.vue";
import MoreContent from "@/components/MoreContent.vue";

const store = mainStore();
</script>

<style lang="scss" scoped>
.box {
  flex: 1 0 0%;
  margin-left: 0.75rem;
  height: 80%;
  max-width: 50%;
  position: relative;
  animation: fade 0.5s;

  &:hover {
    transform: scale(1);
  }

  .close,
  .setting {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    // 默认隐形但保留可聚焦性（opacity 方案），hover 或焦点进入盒子即显形
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.3s,
      transform 0.3s;
  }

  &:hover,
  &:focus-within {
    .close,
    .setting {
      opacity: 1;
      pointer-events: auto;

      &:hover {
        transform: scale(1.2);
      }

      &:active {
        transform: scale(1);
      }
    }
  }

  .setting {
    right: 56px;
  }

  .content {
    display: flex;
    flex-direction: column;
    padding: 30px;
    width: 100%;
    height: 100%;
  }
}
</style>
