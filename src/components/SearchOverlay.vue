<template>
  <div class="search-overlay" @click.self="close">
    <div class="panel cards">
      <div class="input-row">
        <Icon size="20">
          <Search />
        </Icon>
        <input
          ref="inputRef"
          v-model="keyword"
          class="search-input"
          type="text"
          placeholder="搜索站内内容，↑↓ 选择，回车打开，Esc 关闭"
          @keydown.enter.prevent="openActive"
          @keydown.up.prevent="moveActive(-1)"
          @keydown.down.prevent="moveActive(1)"
          @keydown.esc.stop="close"
        />
      </div>
      <div class="results" ref="resultsRef">
        <div
          v-for="(item, idx) in displayList"
          :key="item.kind + item.name"
          :class="{ result: true, active: idx === activeIndex }"
          v-ripple
          @click="openItem(item)"
          @mouseenter="activeIndex = idx"
        >
          <span class="name text-hidden">{{ item.name }}</span>
          <span class="tip text-hidden">{{ item.tip }}</span>
        </div>
        <template v-if="keyword.trim()">
          <div
            v-for="engine in searchEngines"
            :key="engine.name"
            class="result"
            v-ripple
            @click="openEngine(engine)"
          >
            <span class="name text-hidden">使用 {{ engine.name }} 搜索「{{ keyword.trim() }}」</span>
            <span class="tip">外部搜索</span>
          </div>
          <div v-if="!displayList.length" class="result empty">站内无匹配，可使用下方外部搜索</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { Search } from "@vicons/fa";
import { mainStore } from "@/store";
import {
  buildSearchIndex,
  filterSearchIndex,
  searchEngines,
  type SearchEngine,
  type SearchItem,
} from "@/utils/search";

const store = mainStore();
const keyword = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const resultsRef = ref<HTMLElement | null>(null);
const index = buildSearchIndex();
const filtered = computed(() => filterSearchIndex(index, keyword.value));

// 键盘导航的当前选中项（空关键词浏览全量索引，有关键词浏览过滤结果）
const activeIndex = ref(0);
const displayList = computed(() => (keyword.value.trim() ? filtered.value : index));
watch(keyword, () => {
  activeIndex.value = 0;
});

// 上下移动选中项（循环滚动），并保持选中项在可视区内
const moveActive = (delta: number): void => {
  const total = displayList.value.length;
  if (!total) return;
  activeIndex.value = (activeIndex.value + delta + total) % total;
  nextTick(() => {
    resultsRef.value?.querySelector(".result.active")?.scrollIntoView?.({ block: "nearest" });
  });
};

onMounted(() => {
  inputRef.value?.focus();
});

// 关闭浮层
const close = (): void => {
  store.searchOpenState = false;
};

// 打开站内条目
const openItem = (item: SearchItem): void => {
  if (item.kind === "link" && item.url) {
    window.open(item.url, "_blank", "noopener,noreferrer");
    close();
    return;
  }
  close();
  if (item.view === "friends") {
    store.friendsOpenState = true;
  } else if (item.view === "settings") {
    store.setOpenState = true;
  } else if (item.view === "music") {
    store.openMusicList();
  }
};

// 回车打开当前选中项
const openActive = (): void => {
  const item = displayList.value[activeIndex.value];
  if (item) openItem(item);
};

// 外部搜索引擎跳转
const openEngine = (engine: SearchEngine): void => {
  window.open(engine.url + encodeURIComponent(keyword.value.trim()), "_blank", "noopener,noreferrer");
};
</script>

<style lang="scss" scoped>
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  background-color: #00000070;
  backdrop-filter: blur(20px);
  animation: fade 0.5s;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 14vh;

  .panel {
    width: min(640px, 92%);
    max-height: 68vh;
    display: flex;
    flex-direction: column;
    padding: 18px;
    border-radius: 8px;

    .input-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 8px;
      background-color: #ffffff18;
      border-bottom: 1px solid #ffffff30;

      .i-icon {
        display: flex;
        flex-shrink: 0;
      }

      .search-input {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        color: #fff;
        font-size: 15px;

        &::placeholder {
          color: #ffffff70;
        }
      }
    }

    .results {
      margin-top: 12px;
      overflow-y: auto;
      padding-right: 4px;

      .result {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover,
        &.active {
          background-color: #ffffff20;
        }

        .name {
          font-size: 14px;
          min-width: 0;
        }

        .tip {
          font-size: 12px;
          opacity: 0.6;
          flex-shrink: 0;
        }

        &.empty {
          justify-content: center;
          cursor: default;
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
