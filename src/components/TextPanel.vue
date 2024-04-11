<template>
  <div class="mt-8 space-y-4">
    <button
      v-if="store.textEmoji"
      class="draggable rounded bg-white/10 h-8 w-8 transition-all group relative !border-purple-500 border-2"
    >
      <span v-if="store.textEmoji.type === 'slack'">
        {{ store.textEmoji.value }}</span
      >
      <img
        class="rounded"
        v-else
        :src="store.textEmoji.value"
        :alt="store.textEmoji.name"
      />

      <!-- TRASH -->
      <i
        class="opacity-0 group-hover:opacity-100 transition-all -top-2 -right-2 absolute bg-red-500 rounded-full p-0.5 cursor-pointer"
        @click="store.removeEmoji(0)"
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

    <div class="flex items-center gap-4">
      <input
        type="text"
        v-model="store.text"
        class="w-full bg-white/10 rounded px-2 py-1"
      />
      <button
        :disabled="!store.textEmoji"
        @click="handleCopyText"
        class="bg-white/10 rounded px-2 py-1 hover:bg-white/20 transition-colors w-48 flex items-center gap-2 justify-center"
        :class="{
          'cursor-not-allowed hover:!bg-white/10': !store.textEmoji,
        }"
      >
        <span>
          {{ copy ? '✅ Copied!' : 'Copy' }}
        </span>

        <Shortcut shortcut="c" ctrl @confirm="handleCopyText" />
      </button>
    </div>

    <div
      v-if="displayPatterns[0].length"
      class="w-fit p-4"
      :style="{
        backgroundColor: store.darkMode ? 'rgb(27, 29, 33)' : 'white',
      }"
    >
      <div
        v-for="(line, index) in displayPatterns"
        :key="index"
        class="flex w-fit"
      >
        <div v-for="(char, index) in line" :key="index" class="w-4 h-4">
          <BaseEmoji v-show="char !== '0'" :emoji="store.textEmoji" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore();

const patterns = computed(() => {
  return textToPatterns(
    store.text,
    store.textSettings.tight ? 'tight' : 'normal'
  );
});

const displayPatterns = computed(() => {
  return patterns.value.split('\n').map((line) => line.split(''));
});

const copy = ref(false);

const handleCopyText = () => {
  if (!store.textEmoji) return;
  const emoji = store.textEmoji;

  if (!emoji) return;

  copy.value = true;

  const copyText = patterns.value
    .replaceAll('0', ':transparent:')
    .replaceAll('1', emoji.name);

  navigator.clipboard.writeText(copyText);

  setTimeout(() => {
    copy.value = false;
  }, 1000);
};
</script>
