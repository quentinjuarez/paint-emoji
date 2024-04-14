<template>
  <div class="select-none h-4 leading-none">
    <span class="text-sm h-4 leading-none" v-if="displayEmoji.type === 'slack'">
      {{ displayEmoji.value }}
    </span>
    <img
      :draggable="false"
      class="select-none"
      v-else
      :src="displayEmoji.value"
      :alt="displayEmoji.name"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  emoji?: Emoji;
}>();

const displayEmoji = computed(() => {
  return props.emoji || { name: ":question:", value: "❓", type: "slack" };
});
</script>
