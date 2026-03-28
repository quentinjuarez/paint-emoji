<template>
  <div class="flex items-center gap-2">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      class="size-4 cursor-pointer rounded border-white/20 bg-white/5 accent-purple-500"
    />
    <label :for="id" class="cursor-pointer text-sm text-white/80 select-none">
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  id: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
