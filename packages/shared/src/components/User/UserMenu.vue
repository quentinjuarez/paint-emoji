<template>
  <UserLogin v-if="!onlineStore.isAuthenticated" />
  <UiPopover v-else v-model="open">
    <template #trigger>
      <UserAvatar @click="open = !open" />
    </template>
    <div class="w-64 p-3">
      <p class="mb-2 text-sm text-white/70">{{ onlineStore.me?.username }}</p>
      <hr class="mb-3 border-white/10" />
      <RouterLink to="/logout">
        <UiButton variant="destructive" class="w-full">Logout</UiButton>
      </RouterLink>
    </div>
  </UiPopover>
</template>

<script setup lang="ts">
const open = ref(false)

const onlineStore = useOnlineStore()
</script>
