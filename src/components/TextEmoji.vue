<template>
  <div class="flex gap-4">
    <input type="text" v-model="text" class="w-full bg-white/10 rounded p-2" />
    <button @click="handleCopyText">COPY</button>
  </div>
</template>

<script setup lang="ts">
const text = ref('');

const store = useStore();

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
