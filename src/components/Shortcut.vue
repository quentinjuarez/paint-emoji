<template>
  <div class="flex items-center gap-1 text-xs">
    <div
      v-if="props.ctrl"
      class="rounded bg-slate-300 text-slate-800 text-center h-4 min-w-4"
    >
      <span v-if="isWindows" class="">Ctrl</span>
      <span v-else-if="isApple" class="">⌘</span>
    </div>
    <div
      v-if="props.shift"
      class="rounded bg-slate-300 text-slate-800 text-center h-4 min-w-4"
    >
      <span v-if="isWindows" class="">Shift</span>
      <span v-else-if="isApple" class="">⇧</span>
    </div>
    <div class="rounded bg-slate-300 text-slate-800 text-center h-4 min-w-4">
      {{ props.shortcut.toUpperCase() }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  shortcut: string;
  ctrl?: boolean;
  shift?: boolean;
}>();

const emit = defineEmits(['confirm']);

const { isWindows, isApple } = useDevice();

const ctrlKey = computed(() => (isApple.value ? 'metaKey' : 'ctrlKey'));

const onKeydown = (event: KeyboardEvent) => {
  if (
    event.key.toLowerCase() === props.shortcut.toLowerCase() &&
    (props.ctrl ? event[ctrlKey.value] : true) &&
    (props.shift ? event.shiftKey : true)
  ) {
    emit('confirm');
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>
