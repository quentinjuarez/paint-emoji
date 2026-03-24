<template>
  <div class="flex flex-col gap-1.5">
    <UiButton class="w-full" @click="saveModal = true">Save</UiButton>
    <UiButton class="w-full" @click="browseModal = true">Browse</UiButton>
    <UiButton class="w-full" @click="mineModal = true">Mine</UiButton>
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
