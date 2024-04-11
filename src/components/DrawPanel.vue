<template>
  <div class="w-full h-[calc(100vh-164px)] space-y-4 mt-4">
    <EmojiSelection />

    <DrawCanvas>
      <div class="flex justify-center">
        <button
          @click="handleCopy"
          class="bg-white/10 rounded px-2 py-1 hover:bg-white/20 transition-colors w-48 flex items-center gap-2 justify-center"
        >
          <span>
            {{ copy ? '✅ Copied!' : 'Copy' }}
          </span>

          <Shortcut shortcut="c" ctrl @confirm="handleCopy" />
        </button>
      </div>
    </DrawCanvas>
  </div>
</template>

<script setup lang="ts">
const store = useStore();

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
      .replaceAll('0', ':_:')
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
