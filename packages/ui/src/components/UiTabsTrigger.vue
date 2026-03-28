<template>
  <component
    :is="href ? 'router-link' : 'button'"
    :to="href"
    :class="
      cn(
        '-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors outline-none',
        active
          ? 'border-purple-500 text-white'
          : 'border-transparent text-white/40 hover:text-white/70'
      )
    "
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { cn } from '../utils'

defineProps<{
  href?: string
  active?: boolean
}>()
</script>
