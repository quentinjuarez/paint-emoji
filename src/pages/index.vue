<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />

    <!-- ─── Emojis section ─────────────────────────────────────── -->
    <div
      v-if="store.section === 'emojis'"
      class="flex flex-1 flex-col gap-4 p-4 lg:flex-row lg:items-start"
    >
      <!-- Left: emoji picker sidebar -->
      <EmojiList />

      <!-- Center: sub-tabs + panel -->
      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <HeaderTabs :tab="store.tab" />

        <DrawPanel v-if="store.tab === 'draw'" />
        <TextPanel v-if="store.tab === 'text'" />
        <WritePanel v-if="store.tab === 'write'" />
      </div>

      <!-- Right: draw/text tools sidebar (desktop only) -->
      <Tools />
    </div>

    <!-- ─── Image Generation section ─────────────────────────── -->
    <div
      v-else-if="store.section === 'gif'"
      class="flex flex-1 flex-col gap-4 p-4 lg:flex-row lg:items-start"
    >
      <!-- Left: mask browser sidebar -->
      <Col>
        <MaskTools />
      </Col>

      <!-- Center: compositor -->
      <div class="flex min-w-0 flex-1 items-start justify-center">
        <Gif />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore()

const handleHashChange = () => {
  const hash = window.location.hash

  if (!hash) {
    store.tab = 'draw'
    return
  }

  const id = hash.slice(1)

  store.tab = id
}

const route = useRoute()

watch(
  () => route.hash,
  () => {
    handleHashChange()
  },
  {
    immediate: true
  }
)
</script>

