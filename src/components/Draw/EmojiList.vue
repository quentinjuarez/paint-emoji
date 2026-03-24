<template>
  <div class="flex h-full w-full shrink-0 flex-col gap-3 border-r border-white/10 p-4 lg:w-52">
    <div class="flex items-center justify-between">
      <UiSectionTitle>Emoji</UiSectionTitle>
      <Shortcut shortcut="k" ctrl @confirm="handleFocus" />
    </div>

    <div class="relative">
      <UiInput
        ref="searchInputRef"
        v-model="query"
        name="search"
        placeholder="Search emoji"
        @focus="focus = true"
        @blur="focus = false"
        @keydown.escape="focus = false"
      />
      <button v-if="query" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white" @click="query = ''">
        ✕
      </button>
    </div>

    <div
      class="min-h-0 flex-1 overflow-y-auto"
      :class="[
        {
          'absolute inset-x-0 top-20 z-50 max-h-[50vh] rounded bg-slate-950 p-2 shadow':
            !isLarge && focus,
          'pointer-events-none h-0! opacity-0': !isLarge && !focus
        }
      ]"
    >
        <div v-if="frequentEmojisCategory.emojis.length > 0 && !query" class="mb-2">
          <p class="mb-1 text-xs font-medium text-white/40">{{ frequentEmojisCategory.name }}</p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="e in frequentEmojisCategory.emojis"
              :key="e.name"
              class="flex size-7 items-center justify-center rounded bg-white/5 transition-colors hover:bg-white/15"
              @click.prevent.stop="handleSelect(e)"
            >
              <BaseEmoji :emoji="e" size="md" />
            </button>
          </div>
        </div>

        <div
          v-for="category in filteredCategories"
          :key="category.key"
          v-show="category.emojis.length > 0"
          class="mb-2"
        >
          <p class="mb-1 text-xs font-medium text-white/40">{{ category.name }}</p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="e in category.emojis"
              :key="e.name"
              class="flex size-7 items-center justify-center rounded bg-white/5 transition-colors hover:bg-white/15"
              @click.prevent.stop="handleSelect(e)"
              v-bind="category.key === 'custom' ? { 'data-tooltip-list': e.name } : {}"
            >
              <BaseEmoji :emoji="e" size="md" />
            </button>

            <!-- <p v-if="filteredEmoji.length === 0" class="text-sm text-gray-500">No emoji found</p> -->
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import tippy from 'tippy.js'
import Fuse from 'fuse.js'
import customEmojisRaw from '@/assets/data/custom-emojis.json'
import slackEmojisRaw from '@/assets/data/slack-emojis.json'

function codesToValue(unified: string) {
  const codePoints = [`0x${unified.split('-')[0]}`]
  // @ts-ignore
  return String.fromCodePoint.apply(null, codePoints)
}

// Destructure imported data directly
const { emojis: customEmojisData } = customEmojisRaw
const { emojis: slackEmojisData, categories: slackCategories } = slackEmojisRaw

const searchInputRef = ref<HTMLInputElement>()
const focus = ref(false)
const query = ref('')

// Transform emoji data into standardized format
const customEmojisCategory = {
  key: 'custom',
  name: 'Custom',
  emojis: customEmojisData.map(
    (e) =>
      ({
        name: `:${e.name}:`,
        value: e.url,
        type: 'custom',
        search: `:${e.name}:`
      }) as Emoji
  )
}

const slackEmojisCategories = slackCategories.map((category) => ({
  key: category.id,
  name: category.name,
  emojis: category.emojis.map(
    (emoji) =>
      ({
        name: `:${emoji}:`,
        value: codesToValue(slackEmojisData[emoji as keyof typeof slackEmojisData].b),
        type: 'slack',
        search: slackEmojisData[emoji as keyof typeof slackEmojisData].j.join(',')
      }) as Emoji
  )
}))

const store = useStore()

const frequentEmojisCategory = computed(() => {
  return {
    key: 'latest',
    name: 'Latest used',
    emojis: store.frequentEmojis
  }
})

const categories = [customEmojisCategory, ...slackEmojisCategories]

// Fuse instance should be created once
const fuse = new Fuse(
  categories.flatMap((c) => c.emojis),
  {
    keys: [
      { name: 'name', weight: 0.7 },
      { name: 'search', weight: 0.3 }
    ],
    threshold: 0.3,
    distance: 100
  }
)

// Use a reactive computed property to avoid re-filtering on every query change
const filteredCategories = computed(() => {
  if (!query.value) return categories

  const items = fuse.search(query.value).map((r) => r.item)
  const itemsNames = new Set(items.map((i) => i.name))

  return categories.map((category) => ({
    ...category,
    emojis: category.emojis.filter((emoji) => itemsNames.has(emoji.name))
  }))
})

// Handle tooltip initialization and destruction more efficiently
let tooltips: any[] = []

const initializeTooltips = () => {
  tooltips.forEach((tooltip) => tooltip.destroy())
  tooltips = []

  document.querySelectorAll('[data-tooltip-list]').forEach((element) => {
    const tooltip = tippy(element, {
      content: (reference) => reference.getAttribute('data-tooltip-list') as string,
      theme: 'light'
    })
    tooltips.push(tooltip)
  })
}

onMounted(initializeTooltips)

watch(query, initializeTooltips)

onUnmounted(() => {
  tooltips.forEach((tooltip) => tooltip.destroy())
})

const handleSelect = (emoji: Emoji) => {
  store.selectEmoji(emoji)
}

const handleFocus = () => {
  searchInputRef.value?.focus()
}

const { isLarge } = useScreen()
</script>
