<template>
  <div v-show="!isMobile" class="flex items-center gap-1 text-xs">
    <div v-if="props.ctrl" class="h-4 min-w-4 rounded bg-slate-300 px-1 text-center text-slate-800">
      <span v-if="isWindows" class="">Ctrl</span>
      <span v-else-if="isApple" class="">⌘</span>
    </div>
    <div
      v-if="props.shift"
      class="h-4 min-w-4 rounded bg-slate-300 px-1 text-center text-slate-800"
    >
      <span v-if="isWindows" class="">Shift</span>
      <span v-else-if="isApple" class="">⇧</span>
    </div>
    <div class="h-4 min-w-4 rounded bg-slate-300 px-1 text-center text-slate-800">
      {{ props.shortcut.toUpperCase() }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  shortcut: string
  ctrl?: boolean
  shift?: boolean
}>()

const emit = defineEmits(['confirm'])

const { isWindows, isApple, isMobile } = useDevice()

const ctrlKey = computed(() => (isApple.value ? 'metaKey' : 'ctrlKey'))

const onKeydown = (event: KeyboardEvent) => {
  if (
    event.key.toLowerCase() === props.shortcut.toLowerCase() &&
    (props.ctrl ? event[ctrlKey.value] : true) &&
    (props.shift ? event.shiftKey : true)
  ) {
    emit('confirm')
    event.preventDefault()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>
