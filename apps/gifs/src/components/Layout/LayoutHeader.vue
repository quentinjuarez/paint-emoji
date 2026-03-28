<template>
  <header class="flex h-16 items-end space-x-4 border-b border-white/10 bg-slate-900 px-4">
    <!-- Brand -->
    <div class="flex h-full items-center space-x-2 pr-16">
      <span class="text-sm font-semibold tracking-tight text-white">GIF Generator</span>
    </div>

    <!-- Beta toggle -->
    <div class="flex h-12 items-center">
      <button
        class="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
        :class="
          store.beta
            ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
            : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/70'
        "
        @click="store.beta = !store.beta"
      >
        <span
          class="inline-block h-3 w-6 rounded-full transition-colors"
          :class="store.beta ? 'bg-green-500' : 'bg-white/20'"
        >
          <span
            class="block h-3 w-3 rounded-full bg-white transition-transform"
            :class="store.beta ? 'translate-x-3' : 'translate-x-0'"
          />
        </span>
        {{ store.beta ? 'WebP' : 'GIF' }}
      </button>
    </div>

    <!-- Spacer -->
    <div class="flex-1" />
  </header>
</template>

<script setup lang="ts">
const store = useStore()
</script>
