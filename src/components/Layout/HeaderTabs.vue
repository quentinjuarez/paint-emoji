<template>
  <nav class="mx-auto flex w-2/3 items-center gap-2 lg:w-1/2">
    <a
      v-for="tab in tabs"
      :key="tab.name"
      :href="`#${tab.name}`"
      class="flex w-full cursor-pointer items-center justify-center rounded bg-white/10 p-1 text-center transition-colors hover:bg-white/20"
      :class="{
        '!bg-purple-500 hover:!bg-purple-600': tab.name === props.tab
      }"
    >
      {{ tab.label }}
    </a>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tab: string
}>()

const tabs = [
  {
    name: 'draw',
    label: 'Draw'
  },
  {
    name: 'text',
    label: 'Text'
  },
  {
    name: 'write',
    label: 'Write'
  },
  {
    name: 'icant',
    label: 'ICANT'
  },
  {
    name: 'gif',
    label: 'Gif'
  }
]
</script>
