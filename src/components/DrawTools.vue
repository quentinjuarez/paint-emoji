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
</script>
