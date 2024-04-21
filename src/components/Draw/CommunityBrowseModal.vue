<template>
  <BaseModal @close="emit('close')">Browse</BaseModal>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])
</script>
