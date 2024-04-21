<template>
  <div
    class="m-0 select-none p-0 leading-none"
    :class="style"
    :data-name="emoji?.name"
    :data-value="emoji?.value"
  >
    <span class="text-center" :class="fontSize" v-if="displayEmoji.type === 'slack'">
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
  emoji?: Emoji
  size: 'sm' | 'md' | 'lg'
}>()

const style = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'size-2 md:size-3 lg:size-4'
    case 'md':
      return 'h-6 w-6'
    case 'lg':
      return 'h-7 w-7'
  }
})

const fontSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-[6px] leading-[8px] md:text-[10px] md:leading-[12px] lg:text-[13px] lg:leading-[16px]'
    case 'md':
      return 'text-[20px]  leading-[24px]'
    case 'lg':
      return 'text-[22px]  leading-[28px]'
  }
})

const displayEmoji = computed(() => {
  return props.emoji || { name: ':question:', value: '❓', type: 'slack' }
})
</script>
