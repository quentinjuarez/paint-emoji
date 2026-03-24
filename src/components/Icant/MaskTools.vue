<template>
  <div>
    <div class="flex flex-col space-y-3">
      <h2 class="text-lg font-bold">Masks</h2>
      <!-- Search bar -->
      <div class="relative">
        <input
          v-model="search"
          type="text"
          placeholder="Search masks..."
          class="w-full rounded bg-white/10 px-3 py-1.5 pr-8 text-sm text-white placeholder-white/40 outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button
          v-if="search"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
          @click="search = ''"
        >
          ✕
        </button>
      </div>
      <!-- Scale selector -->
      <div class="flex gap-1">
        <button
          v-for="scale in SCALES"
          :key="scale"
          class="flex-1 rounded px-2 py-1 text-xs font-medium transition-colors"
          :class="[
            store.selectedMaskScale === scale
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white',
            !currentMaskHasScale(scale) ? 'cursor-not-allowed opacity-30' : ''
          ]"
          :disabled="!currentMaskHasScale(scale)"
          @click="store.selectedMaskScale = scale"
        >
          x{{ scale }}
        </button>
      </div>
      <!-- Grid -->
      <div class="flex max-h-[calc(100vh-260px)] w-[272px] flex-wrap gap-3 overflow-auto">
        <button
          v-for="mask in filteredMasks"
          :key="mask.name"
          class="flex size-30 flex-col items-center justify-center rounded border-2 border-transparent transition-colors hover:bg-white/10"
          :class="{ '!border-purple-500': mask.name === currentMask?.name }"
          @click="selectMask(mask)"
        >
          <img :src="mask.images[0].url" class="size-18" />
          <span class="max-w-[100px] truncate text-xs">{{ mask.name }}</span>
        </button>
        <p v-if="filteredMasks.length === 0" class="w-full text-center text-sm text-white/40">
          No masks found
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import masksData from '@/assets/data/masks.json'

const SCALES = [1, 2, 3, 4]

const masks = masksData as {
  id: string
  name: string
  tags: string[]
  animated: boolean
  images: { scale: number; url: string; width: number; frameCount: number; mime: string }[]
}[]

const store = useStore()
const { currentMask } = storeToRefs(store)

const search = ref('')

const filteredMasks = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return masks
  return masks.filter((m) => m.name.toLowerCase().includes(q))
})

const currentMaskHasScale = (scale: number) => {
  if (!currentMask.value) return scale === 1
  return currentMask.value.images?.some((i: any) => i.scale === scale) ?? scale === 1
}

const selectMask = (mask: (typeof masks)[number]) => {
  store.currentMask = mask
  // Clamp selected scale to what this mask supports
  const available = mask.images.map((i) => i.scale)
  if (!available.includes(store.selectedMaskScale)) {
    store.selectedMaskScale = available[available.length - 1]
  }
}

onMounted(() => {
  if (!currentMask.value) {
    selectMask(masks[0])
  }
})
</script>
