<template>
  <div v-show="store.tab === 'draw'" class="space-y-4">
    <h2 class="text-xl font-bold">Tools</h2>

    <div class="space-y-2">
      <EmojiFiles />

      <div class="flex flex-col justify-center gap-2">
        <button
          @click="reset"
          class="bg-white/10 rounded px-2 py-1 hover:bg-white/20 transition-colors"
        >
          Clear Canvas
        </button>

        <button
          @click="handleCopy"
          class="bg-white/10 rounded px-2 py-1 hover:bg-white/20 transition-colors"
        >
          {{ copy ? '✅ Copied!' : 'Copy' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore();

const reset = () => {
  store.textToCanvas();
  store.frames = [];
};

const copy = ref(false);

const handleCopy = () => {
  try {
    const text = store.lastFrame;

    if (!text) {
      return;
    }

    copy.value = true;

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
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      copy.value = false;
    }, 1000);
  }
};
</script>
