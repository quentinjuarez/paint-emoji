<template>
  <div>
    <div
      class="min-h-screen bg-slate-900 font-custom text-slate-50 selection:bg-purple-500 selection:text-white"
    >
      <DesktopLayout />
    </div>

    <div v-if="store.error" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="rounded-lg bg-white p-4">
        <div class="flex items-center justify-between">
          <h1 class="text-red-500">An error occurred</h1>
        </div>

        <div></div>

        <pre class="overflow-auto text-xs text-red-500">
            {{ error?.stack }}
        </pre>

        <div class="flex items-center justify-between">
          <button @click="copyError" class="mt-2 rounded bg-red-500 px-2 py-1 text-white">
            📝 Copy Error
          </button>

          <button @click="hardRefresh" class="rounded bg-red-500 px-2 py-1 text-white">
            <span>⟳ Refresh</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DesktopLayout from '@/layouts/DesktopLayout.vue'

const { handleResize } = useScreen()

const store = useStore()
const onlineStore = useOnlineStore()

const error = ref<Error>()

useTooltips()

onMounted(() => {
  onlineStore.getMe()
  store.error = false

  store.resetStore()
  window.addEventListener('resize', handleResize)
  handleResize()

  // Error handling
  window.onerror = function (_message, _source, _lineno, _colno, _error) {
    error.value = _error

    store.error = true
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.onerror = null
})

const hardRefresh = () => {
  store.$reset()
  window.location.reload()
}

const copyError = () => {
  const text = error.value?.stack ?? ''
  navigator.clipboard.writeText(text)
}
</script>
