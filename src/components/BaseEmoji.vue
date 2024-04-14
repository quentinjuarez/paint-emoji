<template>
  <div
    class="select-none leading-none m-0 p-0"
    :class="style"
    :data-name="emoji?.name"
    :data-value="emoji?.value"
  >
    <span
      class="text-center"
      :class="fontSize"
      v-if="displayEmoji.type === 'slack'"
    >
      {{ displayEmoji.value }}
    </span>
    <img
      v-else-if="displayEmoji.type === 'custom'"
      :draggable="false"
      class="my-auto select-none"
      :src="displayEmoji.value"
      :alt="displayEmoji.name"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  emoji?: Emoji;
  size: "sm" | "md" | "lg";
}>();

const style = computed(() => {
  switch (props.size) {
    case "sm":
      return "h-4 w-4";
    case "md":
      return "h-6 w-6";
    case "lg":
      return "h-7 w-7";
  }
});

const fontSize = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-[13px] leading-[16px]";
    case "md":
      return "text-[20px]  leading-[24px]";
    case "lg":
      return "text-[22px]  leading-[28px]";
  }
});

const displayEmoji = computed(() => {
  return props.emoji || { name: ":question:", value: "❓", type: "slack" };
});
</script>
