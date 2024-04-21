<template>
  <div class="flex flex-col gap-2">
    <button
      class="w-full rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
      @click="saveModal = true"
    >
      Save
    </button>

    <button
      class="w-full rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
      @click="browseModal = true"
    >
      Browse
    </button>

    <button
      class="w-full rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
      @click="mineModal = true"
    >
      Mine
    </button>
  </div>
  <CommunityBrowseModal v-if="browseModal" @close="browseModal = false" />
  <CommunitySaveModal v-if="saveModal" @close="saveModal = false" />
  <CommunityMineModal v-if="mineModal" @close="mineModal = false" />
</template>

<script setup lang="ts">
const browseModal = ref(false)
const saveModal = ref(false)
const mineModal = ref(false)
</script>
