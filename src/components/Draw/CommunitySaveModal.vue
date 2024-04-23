<template>
  <BaseModal @close="emit('close')">
    <div class="w-96 rounded-lg bg-slate-900 p-4">
      <h2 class="text-xl font-bold">Save</h2>
      <div class="mt-4 flex flex-col gap-2">
        <label class="text-sm" for="title">Title <span class="text-red-500">*</span></label>
        <input
          v-model="title"
          ref="titleInput"
          id="title"
          name="title"
          class="w-full rounded border border-transparent bg-slate-800 px-2 py-1"
          :class="[isValid ? 'focus:border-green-500' : 'focus:border-red-500']"
          placeholder="Title"
        />
        <label class="text-sm" for="description">Description </label>
        <textarea
          v-model="description"
          id="description"
          name="description"
          class="w-full resize-none rounded border border-transparent bg-slate-800 px-2 py-1 transition-colors focus:border-slate-300"
          placeholder="Description"
          rows="4"
        ></textarea>

        <label class="flex cursor-pointer items-center gap-2" for="isPublic">
          <input type="checkbox" class="cursor-pointer" id="isPublic" v-model="isPublic" />
          <span class="text-sm">Public</span>
        </label>

        <button
          class="flex w-full items-center justify-center gap-2 rounded bg-slate-800 px-2 py-1 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:!bg-slate-800"
          :disabled="!isValid || !payload.canvas"
          @click="handleSave"
        >
          <BaseLoader class="size-4" v-if="loading" />
          <span>Save</span>
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import lzString from 'lz-string'
import html2canvas from 'html2canvas'

const store = useStore()
const onlineStore = useOnlineStore()

const emit = defineEmits(['close'])

const loading = ref(false)
const title = ref('')
const description = ref('')
const preview = ref('')

const isPublic = ref(true)

const payload = computed(() => ({
  title: title.value,
  description: description.value,
  emojis: store.emojiSelection,
  canvas: lzString.compressToUTF16(store.lastFrame || ''),
  preview: preview.value,
  isPublic: isPublic.value,
  version: store.version
}))

const isValid = computed(() => title.value.length > 0)

const titleInput = ref<HTMLInputElement>()

const focusInput = () => {
  titleInput.value?.focus()
}

onMounted(() => {
  focusInput()
})

const handleSave = async () => {
  if (!isValid.value || !payload.value.canvas) return

  loading.value = true

  await exportAsPNG()

  const response = await onlineStore.saveDrawing(payload.value)

  if (response) {
    emit('close')
  }

  loading.value = false
}

const exportAsPNG = async () => {
  const canvas = document.getElementById('canvas')

  if (!canvas) return

  const data = await html2canvas(canvas, {
    backgroundColor: 'transparent',
    scale: 1,
    useCORS: true
  })
  preview.value = data.toDataURL('image/png')
}
</script>
