<template>
  <header class="flex h-16 items-end space-x-4 border-b border-white/10 bg-slate-900 px-4">
    <!-- Brand -->
    <div class="flex h-full items-center space-x-2 pr-16">
      <span class="text-sm font-semibold tracking-tight text-white">Paint Emoji</span>
      <span class="hidden h-full items-center text-xs text-white/20 sm:flex">v{{ version }}</span>
    </div>

    <!-- Emoji tabs (draw / text only, no write) -->
    <UiTabs :tab="store.tab" class="h-12">
      <UiTabsTrigger
        v-for="tab in tabs"
        :key="tab.name"
        :href="`#${tab.name}`"
        :active="tab.name === store.tab"
      >
        <span class="pr-1">{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </UiTabsTrigger>
    </UiTabs>

    <!-- Spacer -->
    <div class="flex-1" />

    <!-- User menu -->
    <div class="flex h-full items-center">
      <UserMenu />
    </div>
  </header>
</template>

<script setup lang="ts">
const version = computed(() => __VERSION__)

const store = useStore()

const tabs = [
  { name: 'draw', icon: '✏️', label: 'Draw' },
  { name: 'text', icon: '💬', label: 'Text' }
]
</script>
