<template>
  <div
    class="group relative w-px shrink-0 cursor-col-resize bg-white/10 transition-colors hover:bg-purple-500/60"
    :class="{ 'bg-purple-500/60': isDragging }"
    @mousedown.prevent="startDrag"
  >
    <!-- wider hit area -->
    <div class="absolute inset-y-0 -left-1.5 -right-1.5" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    panelSize: number
    min?: number
    max?: number
  }>(),
  { min: 100, max: 800 }
)

const emit = defineEmits<{
  'update:panelSize': [size: number]
  'drag-start': []
  'drag-end': []
}>()

const isDragging = ref(false)

const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  document.body.style.userSelect = 'none'
  emit('drag-start')

  const startX = e.clientX
  const startSize = props.panelSize

  const onMove = (e: MouseEvent) => {
    const newSize = Math.max(props.min, Math.min(props.max, startSize + e.clientX - startX))
    emit('update:panelSize', newSize)
  }

  const onUp = () => {
    isDragging.value = false
    document.body.style.userSelect = ''
    emit('drag-end')
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}
</script>
