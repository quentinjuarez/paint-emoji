<template>
  <div class="space-y-2">
    <h2 class="text-xl font-bold">Text</h2>

    <div class="flex items-center gap-2">
      <input id="tight-mode" type="checkbox" v-model="isTight" />
      <label for="tight-mode">Tight</label>
    </div>

    <button
      :disabled="!store.textEmoji"
      @click="handleCopyText"
      class="bg-white/10 rounded px-2 py-1 hover:bg-white/20 transition-colors w-full"
      :class="{
        'cursor-not-allowed hover:!bg-white/10': !store.textEmoji,
      }"
    >
      {{ copy ? '✅ Copied!' : 'Copy' }}
    </button>
  </div>
</template>

<script setup lang="ts">
const isTight = ref(false);
const copy = ref(false);

const store = useStore();

const patterns = computed(() => {
  return textToPatterns(store.text, isTight.value ? 'tight' : 'normal');
});

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
