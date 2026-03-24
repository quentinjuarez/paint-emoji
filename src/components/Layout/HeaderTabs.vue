<template>
  <UiTabs class="border-b border-white/10">
    <UiTabsTrigger
      v-for="tab in tabs"
      :key="tab.name"
      :href="`#${tab.name}`"
      :active="tab.name === props.tab"
    >
      <span>{{ tab.icon }}</span>
      <span>{{ tab.label }}</span>
    </UiTabsTrigger>
  </UiTabs>
</template>

<script setup lang="ts">
const props = defineProps<{ tab: string }>()

const tabs = [
  { name: 'draw', icon: '✏️', label: 'Draw' },
  { name: 'text', icon: '💬', label: 'Text' },
  { name: 'write', icon: '📝', label: 'Write' }
]
</script>
