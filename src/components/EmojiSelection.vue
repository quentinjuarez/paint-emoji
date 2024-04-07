<template>
  <div class="flex gap-4">
    <div class="flex gap-1">
      <button
        v-for="(e, index) in store.emojiSelection"
        :key="e.name"
        class="rounded bg-white/10 h-8 w-8 border border-transparent hover:border-white transition-all"
        @click="handleRemove(index)"
      >
        <span v-if="e.type === 'slack'"> {{ e.value }}</span>
        <img v-else :src="e.value" :alt="e.name" />
      </button>
    </div>
    <button @click="handleCopy">COPY</button>
  </div>
</template>

<script setup lang="ts">
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
    .replaceAll('1', store.emojiSelection[0].name);

  navigator.clipboard.writeText(copyText);
};
</script>
