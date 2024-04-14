<template>
  <div class="flex gap-4">
    <EmojiList />

    <div class="mt-4 w-full">
      <HeaderTabs :tab="store.tab" />

      <DrawPanel v-if="store.tab === 'draw'" />
      <TextPanel v-if="store.tab === 'text'" />
    </div>

    <Tools />
  </div>
</template>

<script setup lang="ts">
const store = useStore();

const handleHashChange = () => {
  const hash = window.location.hash;

  if (!hash) {
    store.tab = "draw";
    return;
  }

  const id = hash.slice(1);

  store.tab = id;
};

const route = useRoute();

watch(
  () => route.hash,
  () => {
    handleHashChange();
  },
  {
    immediate: true,
  }
);
</script>
