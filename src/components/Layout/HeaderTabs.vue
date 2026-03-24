<template>
  <nav class="flex gap-0.5 rounded-xl bg-white/5 p-0.5">
    <a
      v-for="tab in tabs"
      :key="tab.name"
      :href="`#${tab.name}`"
      class="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
      :class="
        tab.name === props.tab
          ? 'bg-white/15 text-white shadow-sm'
          : 'text-white/50 hover:bg-white/10 hover:text-white'
      "
    >
      <span>{{ tab.icon }}</span>
      <span>{{ tab.label }}</span>
    </a>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tab: string
}>()

const tabs = [
  { name: 'draw', icon: '✏️', label: 'Draw' },
  { name: 'text', icon: '💬', label: 'Text' },
  { name: 'write', icon: '📝', label: 'Write' }
]
</script>
