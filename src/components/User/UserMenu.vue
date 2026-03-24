<template>
  <UserLogin v-if="!onlineStore.isAuthenticated" />
  <div v-else v-click-outside="handleClose" class="relative">
    <UserAvatar @click="open = !open" />

    <Transition name="fade">
      <div
        v-if="open"
        class="absolute right-0 top-[calc(100%+0.5rem)] z-10 w-64 rounded-lg border border-white/10 bg-slate-800 p-3 shadow-xl"
      >
        <p class="mb-2 text-sm text-white/70">{{ onlineStore.me?.username }}</p>
        <hr class="mb-3 border-white/10" />
        <RouterLink to="/logout">
          <UiButton variant="destructive" class="w-full">Logout</UiButton>
        </RouterLink>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const open = ref(false)

const handleClose = () => {
  open.value = false
}

const onlineStore = useOnlineStore()
</script>
