<template>
  <button
    class="ml-auto flex size-12 items-center justify-center rounded-full border-4 border-slate-700 bg-white/10 text-xl font-bold transition-colors hover:bg-white/20"
  >
    <span v-if="!onlineStore.isAuthenticated" class="p-2">?</span>
    <span v-else>
      <img
        v-if="profilePicture"
        :src="profilePicture"
        alt="Profile cover"
        class="size-full rounded-full object-cover"
      />
      <span v-else class="p-2 uppercase text-white">{{ initials }}</span>
    </span>
  </button>
</template>

<script setup lang="ts">
const onlineStore = useOnlineStore()

const initials = computed(() => {
  const firstName = onlineStore.me?.firstName
  const lastName = onlineStore.me?.lastName
  return firstName && lastName ? `${firstName[0]}${lastName[0]}` : ''
})

const profilePicture = computed(() => onlineStore.me?.profilePicture)
</script>
