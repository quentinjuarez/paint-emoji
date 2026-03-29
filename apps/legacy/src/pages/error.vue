<template>
  <div class="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#202020]">
    <div class="flex flex-col items-center gap-2 rounded bg-[#2a2a2a] px-6 py-4">
      <span class="text-4xl">⚠️</span>
      <p class="text-lg font-semibold text-white">Page not found</p>
      <p class="text-sm text-white/60">The page you are looking for does not exist.</p>
      <UiButton variant="outline" size="sm" @click="goToHome"> Go back home </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const goToHome = () => {
  router.push('/')
}
</script>
