<template>
  <nav class="flex items-center gap-1 border-b border-white/10">
    <a
      v-for="tab in tabs"
      :key="tab.name"
      :href="`#${tab.name}`"
      class="flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors"
      :class="
        tab.name === props.tab
          ? '-mb-px border-white/70 text-white'
          : 'border-transparent text-white/40 hover:border-white/30 hover:text-white'
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
