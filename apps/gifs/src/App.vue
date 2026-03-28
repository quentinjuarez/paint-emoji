<template>
  <div
    class="font-custom h-dvh overflow-hidden bg-slate-900 text-slate-50 selection:bg-purple-500 selection:text-white"
  >
    <RouterView />

    <!-- Error overlay -->
    <Transition name="fade">
      <div
        v-if="store.error"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      >
        <div class="w-full max-w-md rounded-lg bg-slate-800 p-5 shadow-xl">
          <h2 class="mb-3 text-sm font-semibold text-red-400">An error occurred</h2>
          <pre class="mb-4 max-h-40 overflow-auto rounded bg-slate-900 p-3 text-xs text-red-300">
            {{ error?.stack }}
          </pre>
          <div class="flex justify-end gap-2">
            <UiButton variant="ghost" size="sm" @click="copyError">Copy</UiButton>
            <UiButton variant="destructive" size="sm" @click="hardRefresh">Refresh</UiButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { height } = useWindowSize()
watch(
  height,
  (h) => {
    document.documentElement.style.setProperty('--vh', `${h * 0.01}px`)
  },
  { immediate: true }
)

const store = useStore()

const error = ref<Error>()

onMounted(() => {
  store.error = false
  store.resetStore()

  window.onerror = (_msg, _src, _line, _col, _error) => {
    error.value = _error
    store.error = true
  }
})

onUnmounted(() => {
  window.onerror = null
})

const hardRefresh = () => {
  store.$reset()
  window.location.reload()
}

const copyError = () => {
  navigator.clipboard.writeText(error.value?.stack ?? '')
}
</script>
