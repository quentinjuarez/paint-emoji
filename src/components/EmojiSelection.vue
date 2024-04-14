<template>
  <div class="flex gap-2 justify-center">
    <Sortable
      :list="store.emojiSelection"
      :options="options"
      item-key="name"
      tag="div"
      class="flex gap-2 justify-center"
      @move="disabledHover = true"
      @end="disabledHover = false"
      @update="onUpdate"
    >
      <template #item="{ element, index }">
        <button
          class="draggable rounded bg-white/10 h-8 w-8 border-2 border-transparent hover:border-white transition-all group relative"
          :class="[
            store.selectedEmojiIndex === index
              ? '!border-purple-500 hover:!border-purple-600'
              : '',
            { 'hover:!border-transparent': disabledHover },
          ]"
          @click="store.selectedEmojiIndex = index"
        >
          <BaseEmoji :emoji="element" size="lg" />
          <!-- TRASH -->
          <i
            v-if="!disabledHover || element.type !== 'empty'"
            class="opacity-0 group-hover:opacity-100 transition-all -top-2 -right-2 absolute bg-red-500 rounded-full p-0.5 cursor-pointer"
            @click="handleRemove(index)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-white"
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
      id="clear-button"
      class="rounded bg-white/10 h-8 w-8 border border-transparent hover:border-white transition-all group relative flex justify-center items-center"
      :class="[
        store.selectedEmojiIndex === undefined
          ? '!border-purple-500 hover:!border-purple-600'
          : '',
      ]"
      @click="store.clearEmojiSelection()"
      data-tooltip="Clear"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-white"
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
import { Sortable } from "sortablejs-vue3";
import tippy from "tippy.js";

const disabledHover = ref(false);
const options = ref({
  draggable: ".draggable",
  animation: 250,
});

const store = useStore();

const handleRemove = (index: number) => {
  store.removeEmoji(index);
};

function onUpdate(event: any): void {
  if (event.oldIndex === undefined || event.newIndex === undefined) return;

  // switch the elements in the array
  const element = store.emojiSelection[event.oldIndex];
  store.emojiSelection.splice(event.oldIndex, 1);
  store.emojiSelection.splice(event.newIndex, 0, element);
}

let tooltips = [] as any[];

onMounted(() => {
  initializeTooltips();
});

function initializeTooltips() {
  // Destroy existing tooltips
  tooltips.forEach((tooltip) => tooltip.destroy());
  tooltips = [];

  // Initialize new tooltips
  document.querySelectorAll("#clear-button").forEach((element) => {
    // @ts-ignore
    const tooltip = tippy(element, {
      content(reference) {
        return reference.getAttribute("data-tooltip");
      },
      theme: "light", // Specify the theme as 'light'
    });
    tooltips.push(tooltip);
  });
}

onUnmounted(() => {
  tooltips.forEach((tooltip) => tooltip.destroy());
});
</script>
