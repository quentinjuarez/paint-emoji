<template>
  <header
    class="sticky top-0 z-20 border-b border-white/10 bg-slate-900/95 shadow-sm backdrop-blur-sm"
  >
    <div class="flex items-center gap-3 px-4 py-2.5">
      <!-- Brand -->
      <div class="mr-1 select-none">
        <span class="text-base font-bold tracking-tight">✨ Shape Emoji</span>
      </div>

      <!-- Section nav -->
      <nav class="flex gap-0.5 rounded-xl bg-white/5 p-0.5">
        <a
          :href="emojiHref"
          class="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
          :class="
            store.section === 'emojis'
              ? 'bg-purple-500 text-white shadow-sm'
              : 'text-white/50 hover:bg-white/10 hover:text-white'
          "
        >
          🎨 Emojis
        </a>
        <a
          href="#gif"
          class="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
          :class="
            store.section === 'gif'
              ? 'bg-purple-500 text-white shadow-sm'
              : 'text-white/50 hover:bg-white/10 hover:text-white'
          "
        >
          🎬 Génération
        </a>
      </nav>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Version badge -->
      <span class="hidden text-xs text-white/25 sm:block">v{{ version }}</span>

      <!-- User menu -->
      <UserMenu />
    </div>
  </header>
</template>

<script setup lang="ts">
const store = useStore()
const version = computed(() => __VERSION__)

// When switching to emojis, keep current emoji sub-tab (or fallback to draw)
const emojiHref = computed(() => {
  const t = store.tab
  return t === 'gif' ? '#draw' : `#${t}`
})
</script>
