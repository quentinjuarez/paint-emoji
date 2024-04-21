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
  </div>
  <CommunityBrowseModal v-if="browseModal" @close="browseModal = false" />
  <CommunitySaveModal v-if="saveModal" @close="saveModal = false" />
</template>

<script setup lang="ts">
const browseModal = ref(false)
const saveModal = ref(false)
</script>
