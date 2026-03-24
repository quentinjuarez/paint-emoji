<template>
  <UiDialog @close="emit('close')">
    <div class="h-[646px] w-[768px] space-y-4 rounded-lg bg-slate-900 p-4">
      <h2 class="text-xl font-bold">Browse</h2>
      <div>
        <UiInput v-model="query" placeholder="Search" @input="debounceSearch" />
      </div>
      <div class="flex h-[calc(216px+216px+24px)] flex-wrap gap-4 overflow-auto">
        <div
          v-for="item in onlineStore.search.items"
          :key="item._id"
          class="h-[216px] w-[168px] shrink-0 grow-0 basis-[calc(25%-16px)] flex-col gap-2"
        >
          <button
            class="w-[168px] rounded-lg p-2 text-left transition-colors hover:bg-slate-800"
            @click="handleClick($event, item._id)"
          >
            <img :src="item.preview" class="w-full rounded-lg bg-white" />
            <div class="mt-1 flex items-start gap-2">
              <UiAvatar v-if="item.author" v-bind="item.author" />
              <h3 class="line-clamp-2 h-12 text-base font-bold">{{ item.title }}</h3>
            </div>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-center gap-2 py-4">
        <UiButton size="icon" :disabled="offset === 0" @click="handlePrev"
          ><ChevronLeft class="size-4"
        /></UiButton>
        <span class="text-sm">{{ page }} / {{ pages }}</span>
        <UiButton
          size="icon"
          :disabled="offset + LIMIT >= onlineStore.search.total"
          @click="handleNext"
          ><ChevronRight class="size-4"
        /></UiButton>
      </div>
    </div>

    <div ref="tooltipRef" class="hidden space-y-4 p-2" id="browse-tooltip">
      <h3 class="text-lg font-bold">Import this drawing?</h3>
      <UiCheckbox id="import-emojis" v-model="importEmojis">Import emojis</UiCheckbox>
      <div class="flex items-center justify-center gap-2">
        <UiButton class="bg-green-600 hover:bg-green-500" @click="handleSelect">Import</UiButton>
      </div>
    </div>
  </UiDialog>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import tippy from 'tippy.js'
import debounce from 'lodash.debounce'
import lzString from 'lz-string'

const emit = defineEmits(['close'])

const onlineStore = useOnlineStore()

const LIMIT = 8
const offset = ref(0)
const query = ref('')

onMounted(() => {
  onlineStore.getDrawings()
})

onUnmounted(() => {
  tooltip.value?.destroy()
})

const handleSearch = () => {
  return onlineStore.searchDrawings({ query: query.value, limit: LIMIT, offset: offset.value })
}

const debounceSearch = debounce(handleSearch, 500)

const pages = computed(() => Math.ceil(onlineStore.search.total / LIMIT))
const page = computed(() => Math.ceil(offset.value / LIMIT) + 1)

const handlePrev = () => {
  if (offset.value - LIMIT >= 0) {
    offset.value -= LIMIT
    handleSearch()
  }
}

const handleNext = () => {
  if (offset.value + LIMIT < onlineStore.search.total) {
    offset.value += LIMIT
    handleSearch()
  }
}

const tooltip = ref<any>(null)
const tooltipRef = ref(null)
const tooltipId = ref<string>()

const handleClick = (e: Event, id: string) => {
  tooltip.value?.destroy()
  tooltipId.value = id

  if (!tooltipRef.value || !e.target) return

  tooltip.value = tippy(e.target as HTMLElement, {
    content: tooltipRef.value,
    trigger: 'click',
    interactive: true,
    appendTo: document.body,
    onHidden: () => {
      tooltipId.value = undefined
    }
  })

  e.target.dispatchEvent(new Event('click'))
}

const importEmojis = ref(false)
const store = useStore()

const handleSelect = () => {
  const drawing = onlineStore.search.items.find((item) => item._id === tooltipId.value)

  if (!drawing) return

  if (importEmojis.value) {
    store.emojiSelection = drawing.emojis
  }

  const decodedText = lzString.decompressFromUTF16(drawing.canvas)

  store.addFrame(decodedText)
  store.textToCanvas(decodedText)

  tooltip.value?.destroy()
  importEmojis.value = false
  tooltipId.value = undefined
  emit('close')
}
</script>

<style>
/* Update the tooltip display property to block */
div[data-tippy-root] > div.tippy-box > div.tippy-content > #browse-tooltip {
  display: block !important;
}
</style>
