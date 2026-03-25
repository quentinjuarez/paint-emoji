<template>
  <header class="flex h-12 shrink-0 items-stretch border-b border-white/10 bg-slate-900 px-4">
    <!-- Brand -->
    <div class="flex shrink-0 items-center border-r border-white/10 pr-4 select-none">
      <span class="text-sm font-semibold tracking-tight text-white">Shape Emoji</span>
    </div>

    <!-- Section nav -->
    <UiTabs class="pl-1">
      <UiTabsTrigger :href="'/emojis'" :active="route.name === 'emojis'">Emojis</UiTabsTrigger>
      <UiTabsTrigger :href="'/gif'" :active="route.name === 'gif'">Gif</UiTabsTrigger>
    </UiTabs>

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
const version = computed(() => __VERSION__)

const route = useRoute()
</script>
