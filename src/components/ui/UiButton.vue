<template>
  <button
    :class="cn(buttonVariants({ variant, size }), $attrs.class as string)"
    v-bind="filteredAttrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { computed, useAttrs } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'ghost' | 'destructive' | 'outline'
    size?: 'default' | 'sm' | 'icon'
  }>(),
  { variant: 'default', size: 'default' }
)

const attrs = useAttrs()
const filteredAttrs = computed(() => {
  const { class: _, ...rest } = attrs
  return rest
})

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-white/10 text-white hover:bg-white/20',
        ghost: 'text-white/60 hover:bg-white/10 hover:text-white',
        destructive: 'bg-red-500/80 text-white hover:bg-red-500',
        outline: 'border border-white/20 text-white hover:bg-white/10'
      },
      size: {
        default: 'h-9 px-3',
        sm: 'h-7 px-2 text-xs',
        icon: 'size-8'
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
)
</script>

<script lang="ts">
export default { inheritAttrs: false }
</script>
