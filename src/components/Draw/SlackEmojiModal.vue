<template>
  <BaseModal @close="emit('close')">
    <Picker
      :data="emojiIndex"
      set="google"
      @select="selectEmoji"
      :emojiButtonRadius="'6px'"
      :emojiButtonColors="[
        'rgba(155,223,88,.7)',
        'rgba(149,211,254,.7)',
        'rgba(247,233,34,.7)',
        'rgba(238,166,252,.7)',
        'rgba(255,213,143,.7)',
        'rgba(211,209,255,.7)'
      ]"
    />
  </BaseModal>
</template>

<script setup lang="ts">
import data from 'emoji-mart-vue-fast/data/google.json'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
// @ts-ignore
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'

// Create emoji data index.
// We can change it (for example, filter by category) before passing to the component.
let emojiIndex = new EmojiIndex(data)

const selectEmoji = (emoji: { native: string; colons: string }) => {
  return emit('select', {
    value: emoji.native,
    name: emoji.colons,
    type: 'slack'
  })
}

const emit = defineEmits(['close', 'select'])
</script>

<style>
:deep(.emoji-mart-category .emoji-mart-emoji span) {
  cursor: pointer !important;
}
</style>
