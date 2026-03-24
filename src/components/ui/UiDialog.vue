<template>
  <DialogRoot open @update:open="!$event && emit('close')">
    <DialogPortal>
      <Transition name="fade" appear>
        <DialogOverlay class="fixed inset-0 z-50 bg-black/60" />
      </Transition>
      <Transition name="dialog-content" appear>
        <DialogContent
          class="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
          @escape-key-down.prevent="emit('close')"
          @interact-outside="emit('close')"
        >
          <slot />
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent } from 'radix-vue'

const emit = defineEmits<{ (e: 'close'): void }>()
</script>
