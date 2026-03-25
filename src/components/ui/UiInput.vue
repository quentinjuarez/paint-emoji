<template>
  <input
    :class="
      cn(
        'flex h-9 w-full rounded-md border border-white/20 bg-white/5 px-3 py-1 text-sm text-white transition-colors placeholder:text-white/40 focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        $attrs.class as string
      )
    "
    :value="modelValue"
    v-bind="filteredAttrs"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
import { cn } from '@/components/ui/utils'

const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const attrs = useAttrs()
const filteredAttrs = computed(() => {
  const { class: _, ...rest } = attrs
  return rest
})
</script>

<script lang="ts">
export default { inheritAttrs: false }
</script>
