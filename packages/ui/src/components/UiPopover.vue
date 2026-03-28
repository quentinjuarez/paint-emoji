<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <Transition name="fade">
        <PopoverContent
          v-bind="$attrs"
          :side="side"
          :align="align"
          :side-offset="sideOffset"
          class="z-50 rounded-lg border border-white/10 bg-slate-800 shadow-xl focus:outline-none"
          @interact-outside="open = false"
          @escape-key-down="open = false"
        >
          <slot />
        </PopoverContent>
      </Transition>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import { PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent } from 'radix-vue'

withDefaults(
  defineProps<{
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
  }>(),
  {
    side: 'bottom',
    align: 'end',
    sideOffset: 8
  }
)

const open = defineModel<boolean>({ default: false })
</script>
