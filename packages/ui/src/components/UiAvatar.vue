<template>
  <div class="flex size-6 flex-none items-center justify-center" v-tooltip="props.username">
    <img
      v-if="props.profilePicture"
      :src="props.profilePicture"
      alt="Profile cover"
      class="size-full rounded-full object-cover"
    />
    <span v-else class="bg-purple-500 font-bold text-white uppercase">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  username: string
  firstName: string
  lastName: string
  profilePicture?: string
}>()

const initials = computed(() => {
  const { firstName, lastName } = props
  return `${firstName[0]}${lastName[0]}`
})
</script>
