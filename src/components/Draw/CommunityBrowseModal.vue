<template>
  <BaseModal @close="emit('close')">
    <div class="h-[700px] w-[768px] space-y-4 rounded-lg bg-slate-900 p-4">
      <h2 class="text-xl font-bold">Browse</h2>
      <div>
        <input
          v-model="query"
          class="w-full rounded border border-transparent bg-slate-800 px-2 py-1"
          placeholder="Search"
          @input="debounceSearch"
        />
      </div>
      <div class="flex h-[calc(216px+216px+16px)] flex-wrap gap-4 overflow-auto">
        <div
          v-for="item in onlineStore.search.items"
          :key="item._id"
          class="h-[216px] shrink-0 grow-0 basis-[calc(25%-16px)] flex-col gap-2"
        >
          <button
            class="rounded-lg p-2 text-left transition-colors hover:bg-slate-800"
            @click="handleClick($event, item._id)"
          >
            <img :src="item.preview" class="w-full rounded-lg" />
            <div class="flex flex-col gap-1">
              <h3 class="line-clamp-2 h-12 text-base font-bold">{{ item.title }}</h3>
              <!-- <p class="line-clamp-4 h-20 text-sm">{{ item.description }}</p> -->
            </div>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-center gap-2">
        <button
          class="flex size-8 items-center justify-center rounded bg-white/10 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:select-none disabled:opacity-50 disabled:hover:!bg-white/10"
          :disabled="offset === 0"
          @click="handlePrev"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.707 3.293a1 1 0 010 1.414L6.414 9H16a1 1 0 010 2H6.414l4.293 4.293a1 1 0 11-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <span>{{ page }} / {{ pages }}</span>
        <button
          class="flex size-8 items-center justify-center rounded bg-white/10 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:select-none disabled:opacity-50 disabled:hover:!bg-white/10"
          :disabled="offset + LIMIT >= onlineStore.search.total"
          @click="handleNext"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.293 16.707a1 1 0 010-1.414L13.586 11H4a1 1 0 010-2h9.586l-4.293-4.293a1 1 0 111.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <div ref="tooltipRef" class="hidden space-y-4 p-2" id="browse-tooltip">
      <h3 class="text-lg font-bold">Import this drawing?</h3>
      <div>
        <label class="text-sm">
          <input v-model="importEmojis" type="checkbox" class="mr-2" />
          <span>Import emojis</span>
        </label>
      </div>
      <div class="flex items-center justify-center gap-2">
        <button @click="handleSelect" class="rounded-lg bg-green-500 p-2 text-white">Yes</button>
        <button @click="handleCancel" class="rounded-lg bg-red-500 p-2 text-white">No</button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
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
      tooltip.value?.destroy()
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

const handleCancel = () => {
  tooltip.value?.destroy()
  importEmojis.value = false
  tooltipId.value = undefined
}
</script>

<style>
/* Update the tooltip display property to block */
div[data-tippy-root] > div.tippy-box > div.tippy-content > #browse-tooltip {
  display: block !important;
}
</style>
