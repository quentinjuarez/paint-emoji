<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :class="cn(
      'flex items-center gap-1.5 border-b-2 -mb-px px-4 py-2.5 text-sm font-medium outline-none transition-colors whitespace-nowrap',
      active
        ? 'border-purple-500 text-white'
        : 'border-transparent text-white/40 hover:text-white/70'
    )"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  href?: string
  active?: boolean
}>()
</script>
