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
      <button
        v-if="query"
        class="absolute top-1/2 right-2.5 -translate-y-1/2 text-white/40 hover:text-white"
        @click="query = ''"
      >
        <X class="size-3.5" />
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
            <UiEmoji :emoji="e" size="md" />
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
            v-tooltip="category.key === 'custom' ? e.name : undefined"
          >
            <UiEmoji :emoji="e" size="md" />
          </button>

          <!-- <p v-if="filteredEmoji.length === 0" class="text-sm text-gray-500">No emoji found</p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import Fuse from 'fuse.js'
import slackEmojisRaw from '../../assets/data/slack-emojis.json'

function codesToValue(unified: string) {
  const codePoints = [`0x${unified.split('-')[0]}`]
  // @ts-expect-error
  return String.fromCodePoint.apply(null, codePoints)
}

// Destructure imported data directly
const { emojis: slackEmojisData, categories: slackCategories } = slackEmojisRaw

const searchInputRef = ref<HTMLInputElement>()
const focus = ref(false)
const query = ref('')

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
const onlineStore = useOnlineStore()

onMounted(() => {
  onlineStore.fetchCustomEmojis()
})

const frequentEmojisCategory = computed(() => {
  return {
    key: 'latest',
    name: 'Latest used',
    emojis: store.frequentEmojis
  }
})

const customEmojisCategory = computed(() => ({
  key: 'custom',
  name: 'Custom (Slack)',
  emojis: onlineStore.customEmojis
}))

const categories = computed(() => [customEmojisCategory.value, ...slackEmojisCategories])

// Fuse instance rebuilt when custom emojis change
const fuse = computed(
  () =>
    new Fuse(
      categories.value.flatMap((c) => c.emojis),
      {
        keys: [
          { name: 'name', weight: 0.7 },
          { name: 'search', weight: 0.3 }
        ],
        threshold: 0.3,
        distance: 100
      }
    )
)

// Use a reactive computed property to avoid re-filtering on every query change
const filteredCategories = computed(() => {
  if (!query.value) return categories.value

  const items = fuse.value.search(query.value).map((r) => r.item)
  const itemsNames = new Set(items.map((i) => i.name))

  return categories.value.map((category) => ({
    ...category,
    emojis: category.emojis.filter((emoji) => itemsNames.has(emoji.name))
  }))
})

// Handle tooltip initialization and destruction more efficiently

const handleSelect = (emoji: Emoji) => {
  store.selectEmoji(emoji)
}

const handleFocus = () => {
  searchInputRef.value?.focus()
}

const isLarge = useBreakpoints(breakpointsTailwind).greaterOrEqual('lg')
</script>
