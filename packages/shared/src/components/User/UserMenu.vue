<template>
  <UserLogin v-if="!onlineStore.isAuthenticated" />
  <UiPopover v-else>
    <template #trigger>
      <UserAvatar />
    </template>
    <div class="w-64 p-3">
      <p class="mb-2 text-sm text-white/70">{{ onlineStore.me?.username }}</p>
      <hr class="mb-3 border-white/10" />
      <UiButton class="mb-2 w-full" :disabled="connecting" @click="connectSlack">
        <span class="mr-1">🔗</span>
        {{ connecting ? 'Redirecting…' : 'Connect Slack workspace' }}
      </UiButton>
      <RouterLink to="/logout">
        <UiButton variant="destructive" class="w-full">Logout</UiButton>
      </RouterLink>
    </div>
  </UiPopover>
</template>

<script setup lang="ts">
const connecting = ref(false)

const onlineStore = useOnlineStore()

async function connectSlack() {
  connecting.value = true
  try {
    const url = await onlineStore.getSlackOAuthUrl()
    if (url) window.location.href = url
  } finally {
    connecting.value = false
  }
}
</script>
