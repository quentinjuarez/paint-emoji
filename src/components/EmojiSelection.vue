<template>
  <div class="flex gap-4">
    <div class="flex gap-1 py-2">
      <button
        v-for="(e, index) in store.emojiSelection"
        :key="e.name"
        class="rounded bg-white/10 h-8 w-8 border border-transparent hover:border-white transition-all group relative"
        :class="[
          store.selectedEmojiIndex === index
            ? '!border-purple-500 hover:!border-purple-600'
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
        class="rounded bg-white/10 h-8 w-8 border border-transparent hover:border-white transition-all group relative"
        :class="[
          store.selectedEmojiIndex === undefined
            ? '!border-purple-500 hover:!border-purple-600'
            : '',
        ]"
        @click="store.selectedEmojiIndex = undefined"
      >
        🗑️
      </button>
    </div>
    <button @click="handleCopy">COPY</button>
  </div>

  <div class="flex gap-4">
    <input type="text" v-model="text" class="w-full bg-white/10 rounded p-2" />
    <button @click="handleCopyText">COPY</button>
  </div>
</template>

<script setup lang="ts">
const text = ref('');

const store = useStore();

const handleRemove = (index: number) => {
  store.removeEmoji(index);
};

const handleCopy = () => {
  const text = store.lastFrame;

  const lines = text.trim().split('\n');

  let start = 0;
  let end = lines.length - 1;

  // Find the first non-empty row from the start
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '0'.repeat(24)) {
      start = i;
      break;
    }
  }

  // Find the last non-empty row from the end
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() !== '0'.repeat(24)) {
      end = i;
      break;
    }
  }

  const trimmedLines = lines.slice(start, end + 1);

  // const optimizedLines = trimmedLines.map((line) =>
  //   line.replace(/1.*0+$/g, '1').replace(/.*0+$/g, '0')
  // );

  const copyText = trimmedLines
    .join('\n')
    .replaceAll('0', ':transparent:')
    .replace(/\d/g, (match) => {
      const index = parseInt(match) - 1;
      return index < store.emojiSelection.length
        ? store.emojiSelection[index].name
        : '';
    });

  navigator.clipboard.writeText(copyText);
};

const patterns = computed(() => {
  return textToPatterns(text.value);
});

const handleCopyText = () => {
  if (store.selectedEmojiIndex === undefined) return;
  const emoji = store.emojiSelection[store.selectedEmojiIndex];

  if (!emoji) return;

  const copyText = patterns.value
    .replaceAll('0', ':transparent:')
    .replaceAll('1', emoji.name);

  navigator.clipboard.writeText(copyText);
};
</script>
