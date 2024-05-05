<template>
  <Col>
    <div class="relative flex w-full flex-col space-y-4 lg:w-[calc(176px+15px)]">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">Emoji</h2>
        <Shortcut shortcut="k" ctrl @confirm="handleFocus" />
      </div>

      <div
        class="flex items-center gap-2 rounded border border-slate-500 bg-slate-800 px-3 py-2 transition-all focus:border-purple-500"
        :class="{ 'border-purple-500': focus }"
      >
        <input
          name="search"
          class="m-0 w-full bg-transparent p-0 outline-none"
          ref="searchInputRef"
          v-model="query"
          type="text"
          placeholder="Search emoji"
          @focus="focus = true"
          @blur="focus = false"
          @keydown.escape="focus = false"
        />

        <button v-if="query" @click="query = ''">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4 text-slate-500 transition-all hover:text-slate-100"
            fill="none"
            viewBox="0 0 16 16"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 14L14 4M4 4l10 10"
            ></path>
          </svg>
        </button>
      </div>

      <!-- WRAPPER -->
      <div
        class="overflow-auto"
        :class="[
          {
            'max-h-[calc(100vh-164px)]': isLarge,
            'absolute inset-x-0 top-20 z-50 max-h-[50vh] rounded bg-slate-950 p-2 shadow':
              !isLarge && focus,
            'pointer-events-none !h-0 opacity-0': !isLarge && !focus
          }
        ]"
      >
        <div v-if="frequentEmojisCategory.emojis.length > 0 && !query">
          <h3 class="text-lg font-bold">{{ frequentEmojisCategory.name }}</h3>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="e in frequentEmojisCategory.emojis"
              :key="e.name"
              class="flex size-8 items-center justify-center rounded border border-transparent bg-white/10 transition-all hover:border-white"
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
        >
          <h3 class="text-lg font-bold">{{ category.name }}</h3>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="e in category.emojis"
              :key="e.name"
              class="flex size-8 items-center justify-center rounded border border-transparent bg-white/10 transition-all hover:border-white"
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
  </Col>
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
