<template>
  <div class="flex h-full flex-col gap-3">
    <UiSectionTitle>Masks</UiSectionTitle>

    <div class="relative shrink-0">
      <UiInput v-model="search" placeholder="Search masks..." class="pr-8" />
      <button
        v-if="search"
        class="absolute top-1/2 right-2.5 -translate-y-1/2 text-white/40 hover:text-white"
        @click="search = ''"
      >
        <X class="size-3.5" />
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
    <p class="shrink-0 text-xs text-white/30">{{ filteredMasks.length }} masks</p>

    <!-- Virtual grid -->
    <div ref="scrollEl" class="min-h-0 flex-1 overflow-y-auto">
      <div class="grid grid-cols-3 content-start gap-1.5 pb-2">
        <button
          v-for="mask in visibleMasks"
          :key="mask.id"
          class="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded border-2 border-transparent p-1 transition-colors hover:bg-white/10"
          :class="{ 'border-purple-500!': mask.id === currentMask?.id }"
          @click="selectMask(mask)"
        >
          <img :src="previewUrl(mask)" class="size-10 object-contain" loading="lazy" />
          <span class="w-full truncate text-center text-xs leading-tight">{{ mask.name }}</span>
        </button>
        <!-- Sentinel for infinite loading -->
        <div ref="sentinelEl" class="col-span-3" />
        <p v-if="filteredMasks.length === 0" class="col-span-3 text-center text-sm text-white/40">
          No masks found
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import masksData from '@/assets/data/masks.json'

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
  if (!currentMask.value) return scale === 4
  return currentMask.value.images?.some((i) => i.scale === scale) ?? scale === 4
}

const selectMask = (mask: Mask) => {
  if (store.currentMask?.id === mask.id) {
    store.currentMask = undefined
    return
  }
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
  nextTick(setupObserver)
})

onUnmounted(() => observer?.disconnect())

// Re-attach observer after DOM updates (sentinel position changes)
watch(visibleMasks, () => nextTick(setupObserver))
</script>
