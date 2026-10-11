<template>
  <div
    id="box"
    class="box cards"
    @mouseenter="closeShow = true"
    @mouseleave="closeShow = false"
    @focusin="closeShow = true"
    @focusout="closeShow = false"
  >
    <transition name="el-fade-in-linear">
      <button
        type="button"
        class="close"
        aria-label="关闭盒子"
        v-show="closeShow"
        @click="store.boxOpenState = false"
      >
        <close-one theme="filled" size="28" fill="#ffffff60" />
      </button>
    </transition>
    <transition name="el-fade-in-linear">
      <button
        type="button"
        class="setting"
        aria-label="打开设置"
        v-show="closeShow"
        @click="store.setOpenState = true"
      >
        <setting-two theme="filled" size="28" fill="#ffffff60" />
      </button>
    </transition>
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
const closeShow = ref(false);
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
    transition:
      transform 0.3s,
      opacity 0.3s;

    &:hover {
      transform: scale(1.2);
    }

    &:active {
      transform: scale(1);
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
