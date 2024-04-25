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
          <button class="rounded-lg p-2 text-left transition-colors hover:bg-slate-800">
            <img :src="drawing.preview" class="w-full rounded-lg" />
            <div class="flex flex-col gap-1">
              <h3 class="line-clamp-2 h-12 text-base font-bold">{{ drawing.title }}</h3>
              <!-- <p class="line-clamp-4 h-20 text-sm">{{ item.description }}</p> -->
            </div>
          </button>

          <!-- DELETE -->
          <i
            class="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-red-500 p-0.5 opacity-0 transition-all group-hover:opacity-100"
            @click="onlineStore.deleteDrawing(drawing._id)"
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
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

const onlineStore = useOnlineStore()

onMounted(() => {
  onlineStore.getMineDrawings()
})
</script>
