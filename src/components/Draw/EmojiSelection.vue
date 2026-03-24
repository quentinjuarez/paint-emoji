<template>
  <div class="flex flex-wrap justify-center gap-2 lg:flex-nowrap">
    <Sortable
      :list="list"
      :options="options"
      item-key="index"
      tag="div"
      class="flex justify-center gap-2"
      @move="disabledHover = true"
      @end="disabledHover = false"
      @update="onUpdate"
    >
      <template #item="{ element, index }">
        <button
          class="draggable group relative size-8 rounded border-2 border-transparent bg-white/10 transition-all hover:border-white"
          :class="[
            store.selectedEmojiIndex === index ? 'border-purple-500! hover:border-purple-600!' : '',
            { 'hover:border-transparent!': disabledHover }
          ]"
          @click="store.selectedEmojiIndex = index"
        >
          <BaseEmoji :emoji="element" size="lg" />
          <!-- TRASH -->
          <button
            v-if="!disabledHover && element.type !== 'empty'"
            class="absolute -top-2 -right-2 flex cursor-pointer items-center justify-center rounded-full bg-red-500 p-0.5 opacity-0 transition-all group-hover:opacity-100"
            @click.stop="handleRemove(index)"
          >
            <X class="size-3 text-white" />
          </button>
        </button>
      </template>
    </Sortable>

    <button
      ref="paintButtonRef"
      class="group relative flex size-8 items-center justify-center rounded border-2 border-transparent bg-white/10 transition-all hover:border-white"
      data-tooltip="Paint"
    >
      <Palette class="size-4 text-white" />
    </button>

    <div ref="paintTooltipRef" class="hidden space-y-2 p-1" id="paint-tooltip">
      <h3 class="text-center text-base font-bold">Emojis</h3>
      <div class="flex items-center justify-center gap-2">
        <button
          @click="store.resetEmojiSelection('largeSquares')"
          class="flex size-6 items-center justify-center rounded border border-transparent transition-colors hover:border-purple-500"
        >
          🟥
        </button>
        <button
          @click="store.resetEmojiSelection('hearts')"
          class="flex size-6 items-center justify-center rounded border border-transparent transition-colors hover:border-purple-500"
        >
          ❤️
        </button>
        <button
          @click="store.resetEmojiSelection('circles')"
          class="flex size-6 items-center justify-center rounded border border-transparent transition-colors hover:border-purple-500"
        >
          🔴
        </button>
      </div>
    </div>

    <button
      id="clear-button"
      class="group relative flex size-8 items-center justify-center rounded border-2 border-transparent bg-white/10 transition-all hover:border-white"
      :class="[
        store.selectedEmojiIndex === undefined ? 'border-purple-500! hover:border-purple-600!' : ''
      ]"
      @click="store.clearEmojiSelection()"
      data-tooltip="Clear"
    >
      <X class="size-4 text-white" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { X, Palette } from 'lucide-vue-next'
import { Sortable } from 'sortablejs-vue3'
import tippy from 'tippy.js'

const disabledHover = ref(false)
const options = ref({
  draggable: '.draggable',
  animation: 250
})

const store = useStore()

const handleRemove = (index: number) => {
  store.removeEmoji(index)
}

function onUpdate(event: any): void {
  if (event.oldIndex === undefined || event.newIndex === undefined) return

  // switch the elements in the array
  const element = store.emojiSelection[event.oldIndex]
  store.emojiSelection.splice(event.oldIndex, 1)
  store.emojiSelection.splice(event.newIndex, 0, element)
}

const paintTooltip = ref<any>(null)
const paintButtonRef = ref(null)
const paintTooltipRef = ref(null)

onMounted(() => {
  paintTooltip.value?.destroy()

  if (!paintTooltipRef.value || !paintButtonRef.value) return

  paintTooltip.value = tippy(paintButtonRef.value as HTMLElement, {
    content: paintTooltipRef.value,
    trigger: 'click',
    interactive: true,
    appendTo: document.body
  })
})

onUnmounted(() => {
  paintTooltip.value?.destroy()
})

const list = computed(() =>
  store.emojiSelection.map((e, index) => ({
    ...e,
    index
  }))
)
</script>

<style>
/* Update the tooltip display property to block */
div[data-tippy-root] > div.tippy-box > div.tippy-content > #paint-tooltip {
  display: block !important;
}
</style>
