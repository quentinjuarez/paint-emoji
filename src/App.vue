<template>
  <div
    class="min-h-screen bg-slate-900 font-custom selection:bg-purple-500 selection:text-white text-slate-50"
  >
    <DesktopLayout />
  </div>
</template>

<script setup lang="ts">
import DesktopLayout from "@/layouts/DesktopLayout.vue";

const { handleResize } = useScreen();

const store = useStore();

onMounted(() => {
  store.resetStore();
  window.addEventListener("resize", handleResize);
  handleResize();
});
onUnmounted(() => window.removeEventListener("resize", handleResize));
</script>
