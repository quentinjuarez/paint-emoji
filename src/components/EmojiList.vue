<template>
  <Col>
    <div class="flex flex-col space-y-4 w-[calc(176px+15px)]">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold">Emoji</h2>
        <Shortcut shortcut="k" ctrl @confirm="handleFocus" />
      </div>

      <div
        class="rounded py-2 px-3 border focus:border-purple-500 border-slate-500 transition-all bg-slate-800 flex items-center gap-2"
        :class="{ 'border-purple-500': focus }"
      >
        <input
          class="bg-transparent p-0 m-0 outline-none w-full"
          ref="searchInputRef"
          v-model="query"
          type="text"
          placeholder="Search emoji"
          @focus="focus = true"
          @blur="focus = false"
        />

        <button v-if="query" @click="query = ''">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-slate-500 hover:text-slate-100 transition-all"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 14L14 4M4 4l10 10"
            ></path>
          </svg>
        </button>
      </div>

      <!-- WRAPPER -->
      <div class="max-h-[calc(100vh-164px)] overflow-auto">
        <!-- SLACK -->
        <h3 class="text-lg font-bold">Slack</h3>
        <button
          class="rounded bg-white/10 h-8 w-8 border border-transparent hover:border-white transition-all"
          @click="openModal"
        >
          +
        </button>
        <!-- CUSTOM -->
        <h3 class="text-lg font-bold">Custom</h3>
        <div class="flex gap-1 flex-wrap">
          <button
            id="emoji-button"
            v-for="e in filteredEmoji"
            :key="e.name"
            :tooltip="e.name"
            class="rounded bg-white/10 h-8 w-8 border border-transparent hover:border-white transition-all"
            :data-tooltip="e.name"
            @click="handleCustom(e)"
          >
            <img
              :src="e.url"
              :alt="e.name"
              class="w-auto h-full object-fit mx-auto"
            />
          </button>

          <p v-if="filteredEmoji.length === 0" class="text-sm text-gray-500">
            No emoji found
          </p>
        </div>
      </div>
    </div>
  </Col>
  <SlackEmojiModal v-if="modal" @close="modal = false" @select="handleBase" />
</template>

<script setup lang="ts">
import tippy from "tippy.js";

import Fuse from "fuse.js";

import { emoji } from "@/assets/slack-emoji.json";

const searchInputRef = ref<HTMLInputElement>();
const focus = ref(false);

const query = ref("");

const customEmoji = emoji.map((e) => ({
  name: `:${e.name}:`,
  url: e.url,
}));

const fuse = new Fuse(customEmoji, {
  keys: ["name"],
});

const filteredEmoji = computed(() => {
  if (!query.value) {
    return customEmoji;
  }
  return fuse.search(query.value).map((result) => result.item);
});

let tooltips = [] as any[];

onMounted(() => {
  initializeTooltips();
});

function initializeTooltips() {
  // Destroy existing tooltips
  tooltips.forEach((tooltip) => tooltip.destroy());
  tooltips = [];

  // Initialize new tooltips
  document.querySelectorAll("#emoji-button").forEach((element) => {
    // @ts-ignore
    const tooltip = tippy(element, {
      content(reference) {
        return reference.getAttribute("data-tooltip");
      },
      theme: "light", // Specify the theme as 'light'
    });
    tooltips.push(tooltip);
  });
}

watch(query, () => {
  initializeTooltips();
});

onUnmounted(() => {
  tooltips.forEach((tooltip) => tooltip.destroy());
});

const modal = ref(false);

const openModal = () => {
  modal.value = true;
};

const store = useStore();

const handleBase = (emoji: Emoji) => {
  modal.value = false;
  store.selectEmoji(emoji);
};

const handleCustom = (emoji: CustomEmoji) => {
  store.selectEmoji({
    value: emoji.url,
    name: emoji.name,
    type: "custom",
  });
};

const handleFocus = () => {
  searchInputRef.value?.focus();
};
</script>
