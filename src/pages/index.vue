<template>
  <div class="flex gap-4">
    <EmojiList />

    <div class="mt-4 w-full">
      <HeaderTabs :tab="tab" />

      <DrawPanel v-show="tab === 'draw'" />
      <TextPanel v-show="tab === 'text'" />
    </div>

    <DrawTools />
  </div>
</template>

<script setup lang="ts">
const tab = ref('draw');

const handleHashChange = () => {
  const hash = window.location.hash;

  if (!hash) {
    tab.value = 'draw';
    return;
  }

  const id = hash.slice(1);

  tab.value = id;
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
