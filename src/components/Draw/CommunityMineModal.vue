<template>
  <BaseModal @close="emit('close')">
    <div class="h-[700px] w-[768px] space-y-4 rounded-lg bg-slate-900 p-4">
      <h2 class="text-xl font-bold">My drawings</h2>
      <div class="flex h-[calc(216px+216px+16px)] flex-wrap gap-4 overflow-auto">
        <div
          v-for="drawing in onlineStore.drawings"
          :key="drawing._id"
          class="group relative h-[216px] shrink-0 grow-0 basis-[calc(25%-16px)] flex-col gap-2"
        >
          <button
            class="rounded-lg p-2 text-left transition-colors hover:bg-slate-800"
            @click="handleClick($event, drawing._id)"
          >
            <img :src="drawing.preview" class="w-full rounded-lg bg-white" />
            <div class="flex flex-col gap-1">
              <h3 class="line-clamp-2 h-12 text-base font-bold">{{ drawing.title }}</h3>
              <!-- <p class="line-clamp-4 h-20 text-sm">{{ item.description }}</p> -->
            </div>
          </button>

          <!-- DELETE -->
          <i
            class="absolute right-3 top-3 z-10 cursor-pointer rounded-full bg-red-500 p-0.5 opacity-0 transition-all hover:bg-red-600 group-hover:opacity-100"
            @click="onlineStore.deleteDrawing(drawing._id)"
            :data-tooltip="'Delete'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </i>

          <!-- PUBLIC -->
          <p
            v-if="drawing.isPublic"
            class="absolute left-3 top-3 z-10 flex size-5 cursor-pointer items-center justify-center rounded-full transition-all"
            :data-tooltip="'Public'"
          >
            🌐
          </p>
        </div>
      </div>
    </div>

    <div ref="tooltipRef" class="hidden space-y-4 p-2" id="browse-tooltip">
      <h3 class="text-lg font-bold">Import this drawing?</h3>
      <div>
        <label class="cursor-pointer items-center text-sm">
          <input v-model="importEmojis" type="checkbox" class="mr-2" />
          <span>Import emojis</span>
        </label>
      </div>
      <div class="flex items-center justify-center gap-2">
        <button @click="handleSelect" class="rounded-lg bg-green-500 p-2 text-white">Import</button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import tippy from 'tippy.js'
import lzString from 'lz-string'

const emit = defineEmits(['close'])

const onlineStore = useOnlineStore()

onMounted(() => {
  onlineStore.getMineDrawings()
})

useTooltips()

// ACTIONS
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
</script>
