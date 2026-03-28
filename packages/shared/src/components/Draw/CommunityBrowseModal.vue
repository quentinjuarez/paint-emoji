<template>
  <UiDialog @close="emit('close')">
    <div class="h-160 w-3xl space-y-4 rounded-lg bg-slate-900 p-4">
      <h2 class="text-xl font-bold">Browse</h2>
      <div>
        <UiInput v-model="query" placeholder="Search" @input="debounceSearch" />
      </div>
      <div class="flex h-[calc(216px+216px+24px)] flex-wrap gap-4 overflow-auto">
        <div
          v-for="item in onlineStore.search.items"
          :key="item._id"
          class="h-54 w-42 shrink-0 grow-0 basis-[calc(25%-16px)] flex-col gap-2"
        >
          <VDropdown @show="tooltipId = item._id" @hide="tooltipId = undefined">
            <button class="w-42 rounded-lg p-2 text-left transition-colors hover:bg-slate-800">
              <img :src="item.preview" class="w-full rounded-lg bg-white" />
              <div class="mt-1 flex items-start gap-2">
                <UiAvatar v-if="item.author" v-bind="item.author" />
                <h3 class="line-clamp-2 h-12 text-base font-bold">{{ item.title }}</h3>
              </div>
            </button>
            <template #popper="{ hide }">
              <div class="space-y-4 p-2">
                <h3 class="text-lg font-bold">Import this drawing?</h3>
                <UiCheckbox id="import-emojis" v-model="importEmojis">Import emojis</UiCheckbox>
                <div class="flex items-center justify-center gap-2">
                  <UiButton class="bg-green-600 hover:bg-green-500" @click="handleSelect(hide)"
                    >Import</UiButton
                  >
                </div>
              </div>
            </template>
          </VDropdown>
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
  </UiDialog>
</template>

<script setup lang="ts">
import { useStore } from '../../stores/index'
import { useOnlineStore } from '../../stores/online'
import { onMounted, ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
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

const tooltipId = ref<string>()

const importEmojis = ref(false)
const store = useStore()

const handleSelect = (hide: () => void) => {
  hide()
  const drawing = onlineStore.search.items.find((item) => item._id === tooltipId.value)

  if (!drawing) return

  if (importEmojis.value) {
    store.emojiSelection = drawing.emojis
  }

  const decodedText = lzString.decompressFromUTF16(drawing.canvas)

  store.addFrame(decodedText)
  store.textToCanvas(decodedText)

  importEmojis.value = false
  tooltipId.value = undefined
  emit('close')
}
</script>
