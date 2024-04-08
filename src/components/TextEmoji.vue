<template>
  <div class="space-y-2">
    <input type="text" v-model="text" class="w-full bg-white/10 rounded p-2" />

    <label class="flex items-center gap-2">
      <input type="checkbox" v-model="isTight" />
      <span>Tight</span>
    </label>

    <button
      @click="handleCopyText"
      class="bg-white/10 rounded px-2 py-1 hover:bg-white/20 transition-colors w-full"
    >
      {{ copy ? '✅ Copied!' : 'Copy' }}
    </button>
  </div>
</template>

<script setup lang="ts">
const text = ref('');
const isTight = ref(false);
const copy = ref(false);

const store = useStore();

const patterns = computed(() => {
  return textToPatterns(text.value, isTight.value ? 'tight' : 'normal');
});

const handleCopyText = () => {
  if (store.selectedEmojiIndex === undefined) return;
  const emoji = store.emojiSelection[store.selectedEmojiIndex];

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
