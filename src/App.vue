<template>
  <div>
    <div
      class="min-h-screen bg-slate-900 font-custom selection:bg-purple-500 selection:text-white text-slate-50"
    >
      <DesktopLayout />
    </div>

    <div
      v-if="store.error"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <h1 class="text-red-500">An error occurred</h1>
        </div>

        <div></div>

        <pre class="text-xs text-red-500 overflow-auto">
            {{ error?.stack }}
        </pre>

        <div class="flex justify-between items-center">
          <button
            @click="copyError"
            class="bg-red-500 text-white rounded px-2 py-1 mt-2"
          >
            📝 Copy Error
          </button>

          <button
            @click="hardRefresh"
            class="bg-red-500 text-white rounded px-2 py-1"
          >
            <span>⟳ Refresh</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DesktopLayout from '@/layouts/DesktopLayout.vue';

const { handleResize } = useScreen();

const store = useStore();

const error = ref<Error>();

onMounted(() => {
  store.error = false;

  store.resetStore();
  window.addEventListener('resize', handleResize);
  handleResize();

  // Error handling
  window.onerror = function (_message, _source, _lineno, _colno, _error) {
    error.value = _error;

    store.error = true;
  };
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.onerror = null;
});

const hardRefresh = () => {
  store.$reset();
  window.location.reload();
};

const copyError = () => {
  const text = error.value?.stack ?? '';
  navigator.clipboard.writeText(text);
};
</script>
