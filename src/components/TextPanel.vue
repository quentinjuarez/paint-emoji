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
          {{ copy ? "✅ Copied!" : "Copy" }}
        </span>

        <Shortcut shortcut="c" ctrl @confirm="handleCopyText" />
      </button>
    </div>

    <div
      v-if="displaySplittedPatterns[0].length > 2"
      class="w-fit p-4 overflow-auto max-w-[65vw]"
      :style="{
        backgroundColor: store.darkMode ? 'rgb(27, 29, 33)' : 'white',
      }"
    >
      <div
        v-for="(line, index) in displaySplittedPatterns"
        :key="index"
        class="flex w-fit"
        :class="{
          'mb-4': (index + 1) % 7 === 0,
        }"
      >
        <div v-for="(char, index) in line" :key="index" class="w-4 h-4">
          <BaseEmoji v-show="char !== '0'" :emoji="store.textEmoji" size="sm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore();

const displaySplittedPatterns = computed(() => {
  return splittedTextPatterns.value
    .join("\n")
    .split("\n")
    .map((line) => line.split(""));
});

const copy = ref(false);

const splittedText = computed(() => {
  // i want to split words if the line is too long to fit in the screen
  const words = store.text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if (currentLine.length + word.length > 9) {
      lines.push(currentLine);
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }

  lines.push(currentLine);

  return lines;
});

const handleCopyText = () => {
  if (!store.textEmoji) return;
  const emoji = store.textEmoji;

  if (!emoji) return;

  copy.value = true;

  const copyText = splittedTextPatterns.value
    .join("\n\n")
    .replaceAll("0", ":_:")
    .replaceAll("1", emoji.name);

  navigator.clipboard.writeText(copyText);

  setTimeout(() => {
    copy.value = false;
  }, 1000);
};

const splittedTextPatterns = computed(() => {
  return splittedText.value.map((line) => {
    return textToPatterns(line, store.textSettings.tight ? "tight" : "normal");
  });
});
</script>
