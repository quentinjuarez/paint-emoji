<template>
  <div>
    <div class="flex flex-col space-y-4">
      <h2 class="text-lg font-bold">Masks</h2>
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="mask in masks"
          :key="mask.name"
          class="flex size-30 flex-col items-center justify-center rounded border-2 border-transparent transition-colors hover:bg-white/10"
          :class="{ '!border-purple-500': mask.name === currentMask?.name }"
          @click="currentMask = mask"
        >
          <img :src="mask.src" class="size-18" />
          <span>{{ mask.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import icant from '@/assets/masks/icant.png'
import clean from '@/assets/masks/clean.gif'
import steer from '@/assets/masks/steer.gif'
import rave from '@/assets/masks/rave.gif'
import fourK from '@/assets/masks/fourK.gif'
import arms from '@/assets/masks/arms.gif'
import kawaii from '@/assets/masks/kawaii.gif'
import lighting from '@/assets/masks/lighting.gif'
import poof from '@/assets/masks/poof.gif'
import saiyan from '@/assets/masks/saiyan.gif'
import shiny from '@/assets/masks/shiny.gif'

const masks = [
  // { name: 'icant', src: icant, animate: false },
  { name: 'clean', src: clean, animate: true },
  { name: 'steer', src: steer, animate: true },
  { name: 'rave', src: rave, animate: true },
  { name: '4k', src: fourK, animate: true },
  { name: 'arms', src: arms, animate: true },
  { name: 'kawaii', src: kawaii, animate: true },
  { name: 'lighting', src: lighting, animate: true },
  { name: 'poof', src: poof, animate: true },
  { name: 'saiyan', src: saiyan, animate: true },
  { name: 'shiny', src: shiny, animate: true }
]

const store = useStore()

const { currentMask } = storeToRefs(store)

onMounted(() => {
  if (!currentMask.value) {
    store.currentMask = masks[0]
  }
})
</script>
