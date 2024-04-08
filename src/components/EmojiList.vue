<template>
  <Col>
    <div class="flex flex-col space-y-4 w-[calc(176px+15px)]">
      <h2 class="text-xl font-bold">Emoji</h2>

      <input
        v-model="query"
        type="text"
        placeholder="Search emoji"
        class="rounded p-2 border focus:border-purple-500 border-slate-500 transition-all bg-slate-800"
      />

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
import tippy from 'tippy.js';

import Fuse from 'fuse.js';

import { emoji } from '@/assets/slack-emoji.json';

const query = ref('');

const customEmoji = emoji.map((e) => ({
  name: `:${e.name}:`,
  url: e.url,
}));

const fuse = new Fuse(customEmoji, {
  keys: ['name'],
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
  document.querySelectorAll('#emoji-button').forEach((element) => {
    // @ts-ignore
    const tooltip = tippy(element, {
      content(reference) {
        return reference.getAttribute('data-tooltip');
      },
      theme: 'light', // Specify the theme as 'light'
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
    type: 'custom',
  });
};
</script>
