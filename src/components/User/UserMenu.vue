<template>
  <div v-click-outside="handleClose" class="relative">
    <UserAvatar @click="open = !open" />

    <Transition name="fade">
      <div
        v-if="open"
        class="absolute right-0 top-[calc(100%+0.5rem)] z-10 flex w-80 items-center gap-2 rounded bg-slate-800 p-2 shadow-lg"
      >
        <UserLogin v-if="!onlineStore.isAuthenticated" />
        <div v-else class="w-full">
          <div>{{ onlineStore.me?.username }}</div>

          <hr class="my-2 border-slate-700" />

          <RouterLink
            to="/logout"
            class="flex w-full items-center justify-center rounded bg-red-500 px-3 py-2 transition-colors hover:bg-red-600 active:bg-red-700"
          >
            Logout
          </RouterLink>
        </div>
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
