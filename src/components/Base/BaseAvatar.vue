<template>
  <div class="flex size-6 flex-none items-center justify-center" ref="avatarRef">
    <img
      v-if="props.profilePicture"
      :src="props.profilePicture"
      alt="Profile cover"
      class="size-full rounded-full object-cover"
    />
    <span v-else class="bg-purple-500 font-bold uppercase text-white">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import tippy from 'tippy.js'

type LightUser = {
  username: string
  firstName: string
  lastName: string
  profilePicture?: string
}

const props = defineProps<LightUser>()

const initials = computed(() => {
  const { firstName, lastName } = props
  return `${firstName[0]}${lastName[0]}`
})

const avatarRef = ref<HTMLElement>()

onMounted(() => {
  if (!avatarRef.value) return

  tippy(avatarRef.value, {
    content: props.username,
    placement: 'bottom',
    theme: 'light'
  })
})
</script>

<style>
/* Update the tooltip display property to block */
div[data-tippy-root] > div.tippy-box > div.tippy-content > #avatar-tooltip {
  display: block !important;
}
</style>
