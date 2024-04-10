<template>
  <div class="flex gap-2 justify-center">
    <button
      v-for="(e, index) in store.emojiSelection"
      :key="e.name"
      class="rounded bg-white/10 h-8 w-8 border border-transparent hover:border-white transition-all group relative"
      :class="[
        store.selectedEmojiIndex === index
          ? '!border-purple-500 hover:!border-purple-600 !border-2'
          : '',
      ]"
      @click="store.selectedEmojiIndex = index"
    >
      <span v-if="e.type === 'slack'"> {{ e.value }}</span>
      <img class="rounded" v-else :src="e.value" :alt="e.name" />

      <!-- TRASH -->
      <i
        class="opacity-0 group-hover:opacity-100 transition-all -top-2 -right-2 absolute bg-red-500 rounded-full p-0.5 cursor-pointer"
        @click="handleRemove(index)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </i>
    </button>

    <button
      id="erase-button"
      class="rounded bg-white/10 h-8 w-8 border border-transparent hover:border-white transition-all group relative flex justify-center items-center"
      :class="[
        store.selectedEmojiIndex === undefined
          ? '!border-purple-500 hover:!border-purple-600'
          : '',
      ]"
      @click="store.selectedEmojiIndex = undefined"
      data-tooltip="Erase"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import tippy from 'tippy.js';

const store = useStore();

const handleRemove = (index: number) => {
  store.removeEmoji(index);
};

let tooltips = [] as any[];

onMounted(() => {
  initializeTooltips();
});

function initializeTooltips() {
  // Destroy existing tooltips
  tooltips.forEach((tooltip) => tooltip.destroy());
  tooltips = [];

  // Initialize new tooltips
  document.querySelectorAll('#erase-button').forEach((element) => {
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

onUnmounted(() => {
  tooltips.forEach((tooltip) => tooltip.destroy());
});
</script>
