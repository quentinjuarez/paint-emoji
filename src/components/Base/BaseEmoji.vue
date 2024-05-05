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
      class="select-none object-contain"
      :class="imageSize"
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
      return 'size-3 md:size-4 lg:size-4'
    case 'md':
      return 'h-6 w-6'
    case 'lg':
      return 'h-7 w-7'
  }
})

const fontSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-[10px] leading-[12px] md:text-[13px] md:leading-[16px] lg:text-[13px] lg:leading-[16px] align-center'
    case 'md':
      return 'text-[20px]  leading-[24px]'
    case 'lg':
      return 'text-[22px]  leading-[28px]'
  }
})

const imageSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'size-4'
    case 'md':
      return 'size-6'
    case 'lg':
      return 'size-7'
  }
})

const displayEmoji = computed(() => {
  return props.emoji || { name: ':question:', value: '❓', type: 'slack' }
})
</script>
