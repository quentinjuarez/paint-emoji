<template>
  <div>
    <div class="flex flex-col space-y-4">
      <h2 class="text-lg font-bold">Masks</h2>
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="mask in masks"
          :key="mask.name"
          class="flex size-30 flex-col items-center justify-center rounded border-2 border-transparent transition-colors hover:bg-white/10"
          :class="{ '!border-purple-500': mask.name === currentMask }"
          @click="currentMask = mask.name"
        >
          <img :src="mask.src" class="size-18" />
          <span>{{ mask.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import icant from '@/assets/masks/icant.png'
import clean from '@/assets/masks/clean.gif'

const masks = [
  { name: 'icant', src: icant },
  { name: 'clean', src: clean }
]

const store = useStore()

const { currentMask } = storeToRefs(store)
</script>
