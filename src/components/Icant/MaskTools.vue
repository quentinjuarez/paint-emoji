<template>
  <div>
    <div class="flex flex-col space-y-4">
      <h2 class="text-lg font-bold">Masks</h2>
      <div class="flex max-h-[calc(100vh-180px)] w-[272px] flex-wrap gap-4 overflow-auto">
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
import arms from '@/assets/masks/arms.gif'
import bonk from '@/assets/masks/bonk.gif'
import censored from '@/assets/masks/censored.gif'
import clean from '@/assets/masks/clean.gif'
import confetti from '@/assets/masks/confetti.gif'
import congrats from '@/assets/masks/congrats.gif'
import explosion from '@/assets/masks/explosion.gif'
import fog from '@/assets/masks/fog.gif'
import fourK from '@/assets/masks/fourK.gif'
import gun from '@/assets/masks/gun.gif'
import hyperglass from '@/assets/masks/hyperglass.gif'
// import icant from '@/assets/masks/icant.png'
import kawaii from '@/assets/masks/kawaii.gif'
import lagging from '@/assets/masks/lagging.gif'
import lighting from '@/assets/masks/lighting.gif'
import moneyRain from '@/assets/masks/money-rain.gif'
import pet from '@/assets/masks/pet.gif'
import photo from '@/assets/masks/photo.gif'
import poof from '@/assets/masks/poof.gif'
// import rave from '@/assets/masks/rave.gif'
import saiyan from '@/assets/masks/saiyan.gif'
import shiny from '@/assets/masks/shiny.gif'
import shy from '@/assets/masks/shy.gif'
import spank from '@/assets/masks/spank.gif'
import speed from '@/assets/masks/speed.gif'
import steer from '@/assets/masks/steer.gif'
import tnt from '@/assets/masks/tnt.gif'
import touchGrass from '@/assets/masks/touch-grass.gif'
import wave from '@/assets/masks/wave.gif'
import yap from '@/assets/masks/yap.gif'
import zzz from '@/assets/masks/zzz.gif'

const masks = [
  // { name: 'icant', src: icant, animate: false },
  { name: 'arms', src: arms, animate: true },
  { name: 'bonk', src: bonk, animate: true },
  { name: 'censored', src: censored, animate: true },
  { name: 'clean', src: clean, animate: true },
  { name: 'confetti', src: confetti, animate: true },
  { name: 'congrats', src: congrats, animate: true },
  { name: 'explosion', src: explosion, animate: true },
  { name: 'fog', src: fog, animate: true },
  { name: 'fourK', src: fourK, animate: true },
  { name: 'gun', src: gun, animate: true },
  { name: 'hyperglass', src: hyperglass, animate: true },
  { name: 'kawaii', src: kawaii, animate: true },
  { name: 'lagging', src: lagging, animate: true },
  { name: 'lighting', src: lighting, animate: true },
  { name: 'moneyRain', src: moneyRain, animate: true },
  { name: 'pet', src: pet, animate: true },
  { name: 'photo', src: photo, animate: true },
  { name: 'poof', src: poof, animate: true },
  { name: 'saiyan', src: saiyan, animate: true },
  { name: 'shiny', src: shiny, animate: true },
  { name: 'shy', src: shy, animate: true },
  { name: 'spank', src: spank, animate: true },
  { name: 'speed', src: speed, animate: true },
  { name: 'steer', src: steer, animate: true },
  { name: 'tnt', src: tnt, animate: true },
  { name: 'touchGrass', src: touchGrass, animate: true },
  { name: 'wave', src: wave, animate: true },
  { name: 'yap', src: yap, animate: true },
  { name: 'zzz', src: zzz, animate: true }
]

const store = useStore()

const { currentMask } = storeToRefs(store)

onMounted(() => {
  if (!currentMask.value) {
    store.currentMask = masks[0]
  }
})
</script>
