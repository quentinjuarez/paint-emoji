<template>
  <nav class="flex items-center gap-2 mx-auto w-1/2">
    <a
      v-for="tab in tabs"
      :key="tab.name"
      :href="`#${tab.name}`"
      class="w-full p-1 rounded bg-white/10 text-center flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
      :class="{
        'bg-purple-500 hover:!bg-purple-600': tab.name === props.tab,
      }"
    >
      {{ tab.label }}
    </a>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tab: string;
}>();

const tabs = [
  {
    name: 'draw',
    label: 'Draw',
  },
  {
    name: 'text',
    label: 'Text',
  },
];
</script>
