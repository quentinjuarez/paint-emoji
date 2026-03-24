<template>
  <header class="flex h-12 shrink-0 items-stretch border-b border-white/10 bg-slate-900 px-4">
    <!-- Brand -->
    <div class="flex shrink-0 select-none items-center border-r border-white/10 pr-4">
      <span class="text-sm font-semibold tracking-tight text-white">Shape Emoji</span>
    </div>

    <!-- Section nav -->
    <nav class="flex items-stretch pl-1">
      <a
        :href="emojiHref"
        class="flex items-center px-4 text-sm font-medium transition-colors border-b-2"
        :class="
          store.section === 'emojis'
            ? 'border-purple-500 text-white'
            : 'border-transparent text-white/40 hover:text-white/70'
        "
      >
        Emojis
      </a>
      <a
        href="#gif"
        class="flex items-center px-4 text-sm font-medium transition-colors border-b-2"
        :class="
          store.section === 'gif'
            ? 'border-purple-500 text-white'
            : 'border-transparent text-white/40 hover:text-white/70'
        "
      >
        Génération
      </a>
    </nav>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- Version -->
    <span class="hidden items-center text-xs text-white/20 sm:flex">v{{ version }}</span>

    <!-- User menu -->
    <div class="flex items-center pl-4">
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
