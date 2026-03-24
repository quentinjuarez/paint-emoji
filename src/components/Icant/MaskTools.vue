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
          class="w-full rounded bg-white/10 px-3 py-1.5 pr-8 text-sm text-white outline-none placeholder:text-white/40 focus:ring-1 focus:ring-purple-500"
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
      <!-- Count -->
      <p class="text-xs text-white/30">{{ filteredMasks.length }} masks</p>
      <!-- Virtual grid -->
      <div
        ref="scrollEl"
        class="flex max-h-[calc(100vh-300px)] w-[272px] flex-wrap gap-3 overflow-auto"
      >
        <button
          v-for="mask in visibleMasks"
          :key="mask.id"
          class="flex size-30 flex-col items-center justify-center rounded border-2 border-transparent transition-colors hover:bg-white/10"
          :class="{ '!border-purple-500': mask.id === currentMask?.id }"
          @click="selectMask(mask)"
        >
          <img :src="previewUrl(mask)" class="size-18" loading="lazy" />
          <span class="max-w-25 truncate text-xs">{{ mask.name }}</span>
        </button>
        <!-- Sentinel for infinite loading -->
        <div ref="sentinelEl" class="w-full" />
        <p v-if="filteredMasks.length === 0" class="w-full text-center text-sm text-white/40">
          No masks found
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import masksData from '@/assets/data/masks.json'

type Mask = {
  id: string
  name: string
  tags: string[]
  animated: boolean
  images: { scale: number; url: string; width: number; frameCount: number; mime: string }[]
}

const SCALES = [1, 2, 3, 4]
const PAGE_SIZE = 40

const masks = masksData as Mask[]

const store = useStore()
const { currentMask } = storeToRefs(store)

const search = ref('')
const visibleCount = ref(PAGE_SIZE)
const scrollEl = ref<HTMLElement | null>(null)
const sentinelEl = ref<HTMLElement | null>(null)

// Reset visible window when search changes
watch(search, () => {
  visibleCount.value = PAGE_SIZE
  scrollEl.value?.scrollTo(0, 0)
})

const filteredMasks = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return masks
  return masks.filter(
    (m) => m.name.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q))
  )
})

const visibleMasks = computed(() => filteredMasks.value.slice(0, visibleCount.value))

const previewUrl = (mask: Mask) =>
  mask.images.find((i) => i.scale === 1)?.url ?? mask.images[0]?.url ?? ''

const currentMaskHasScale = (scale: number) => {
  if (!currentMask.value) return scale === 1
  return currentMask.value.images?.some((i: any) => i.scale === scale) ?? scale === 1
}

const selectMask = (mask: Mask) => {
  store.currentMask = mask
  const available = mask.images.map((i) => i.scale)
  if (!available.includes(store.selectedMaskScale)) {
    store.selectedMaskScale = available[available.length - 1]
  }
}

// Infinite scroll via IntersectionObserver on sentinel
let observer: IntersectionObserver | null = null

const setupObserver = () => {
  observer?.disconnect()
  if (!sentinelEl.value) return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, filteredMasks.value.length)
      }
    },
    { root: scrollEl.value, rootMargin: '100px' }
  )
  observer.observe(sentinelEl.value)
}

onMounted(() => {
  if (!currentMask.value) selectMask(masks[0])
  nextTick(setupObserver)
})

onUnmounted(() => observer?.disconnect())

// Re-attach observer after DOM updates (sentinel position changes)
watch(visibleMasks, () => nextTick(setupObserver))
</script>
