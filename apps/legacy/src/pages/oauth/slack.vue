<template>
  <div class="flex h-screen items-center justify-center">
    <div v-if="status === 'loading'" class="flex flex-col items-center gap-4">
      <svg
        class="animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
      <p class="text-sm text-white/60">Connecting Slack workspace…</p>
    </div>

    <div v-else-if="status === 'success'" class="flex flex-col items-center gap-3 text-center">
      <span class="text-4xl">🎉</span>
      <p class="text-lg font-semibold text-white">Slack connected!</p>
      <p v-if="teamName" class="text-sm text-white/60">Workspace: {{ teamName }}</p>
      <p class="text-sm text-white/40">Custom emojis are now available.</p>
    </div>

    <div v-else class="flex flex-col items-center gap-3 text-center">
      <span class="text-4xl">⚠️</span>
      <p class="text-lg font-semibold text-white">Connection failed</p>
      <p class="text-sm text-white/60">{{ errorMessage }}</p>
      <p class="mt-2 font-mono text-xs text-white/30">{{ debugInfo }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const onlineStore = useOnlineStore()

type Status = 'loading' | 'success' | 'error'

const status = ref<Status>('loading')
const teamName = ref<string | undefined>(undefined)
const errorMessage = ref('Something went wrong. Please try again.')
const debugInfo = ref('')

onMounted(async () => {
  const { token, error } = route.query as { token?: string; error?: string }

  console.log('[Slack OAuth] query params:', { token: token?.slice(0, 20) + '...', error })
  debugInfo.value = `token: ${token ? 'present' : 'missing'}, error: ${error ?? 'none'}`

  if (error || !token) {
    errorMessage.value = error ?? 'Connection failed (no token received)'
    status.value = 'error'
    setTimeout(() => router.push('/'), 5000)
    return
  }

  try {
    const decoded = atob(token)
    console.log('[Slack OAuth] decoded token:', decoded)
    const parsed = JSON.parse(decoded) as {
      accessToken: string
      teamId: string
      teamName: string
    }
    console.log('[Slack OAuth] parsed:', {
      teamId: parsed.teamId,
      teamName: parsed.teamName,
      hasToken: !!parsed.accessToken
    })
    onlineStore.connectSlack(parsed)
    console.log('[Slack OAuth] store after connectSlack:', onlineStore.slack)
    teamName.value = parsed.teamName
    status.value = 'success'
  } catch (e) {
    console.error('[Slack OAuth] parse error:', e)
    errorMessage.value = `Invalid token data: ${e}`
    status.value = 'error'
  }

  setTimeout(() => router.push('/'), 3000)
})
</script>
