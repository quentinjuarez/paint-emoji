<template>
  <div class="flex justify-center gap-2">
    <Sortable
      :list="store.emojiSelection"
      :options="options"
      item-key="name"
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
            store.selectedEmojiIndex === index ? '!border-purple-500 hover:!border-purple-600' : '',
            { 'hover:!border-transparent': disabledHover }
          ]"
          @click="store.selectedEmojiIndex = index"
        >
          <BaseEmoji :emoji="element" size="lg" />
          <!-- TRASH -->
          <i
            v-if="!disabledHover && element.type !== 'empty'"
            class="absolute -right-2 -top-2 cursor-pointer rounded-full bg-red-500 p-0.5 opacity-0 transition-all group-hover:opacity-100"
            @click="handleRemove(index)"
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
        </button>
      </template>
    </Sortable>

    <button
      id="reset-button"
      class="group relative flex size-8 items-center justify-center rounded border-2 border-transparent bg-white/10 transition-all hover:border-white"
      @click="store.resetEmojiSelection()"
      data-tooltip="Reset"
    >
      🔄
    </button>

    <button
      id="clear-button"
      class="group relative flex size-8 items-center justify-center rounded border-2 border-transparent bg-white/10 transition-all hover:border-white"
      :class="[
        store.selectedEmojiIndex === undefined ? '!border-purple-500 hover:!border-purple-600' : ''
      ]"
      @click="store.clearEmojiSelection()"
      data-tooltip="Clear"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-6 text-white"
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
    </button>
  </div>
</template>

<script setup lang="ts">
import { Sortable } from 'sortablejs-vue3'

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
</script>
