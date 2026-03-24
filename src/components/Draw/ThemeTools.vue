<template>
  <div class="space-y-3">
    <UiSectionTitle>Slack Theme</UiSectionTitle>
    <UiCheckbox id="dark-mode" v-model="store.darkMode">Dark mode</UiCheckbox>
  </div>
</template>

<script setup lang="ts">
const store = useStore()
</script>
