<template>
  <div class="space-y-3">
    <UiSectionTitle>Text</UiSectionTitle>
    <UiCheckbox id="tight-mode" v-model="store.textSettings.tight">Tight</UiCheckbox>
  </div>
</template>

<script setup lang="ts">
const store = useStore()
</script>
