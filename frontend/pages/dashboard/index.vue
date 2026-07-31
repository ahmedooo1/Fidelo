<script setup lang="ts">
interface Program {
  id: string
  name: string
  stampsRequired: number
  rewardDescription: string
  active: boolean
}

const { request } = useApi()
const auth = useAuthStore()
const router = useRouter()

const programs = ref<Program[]>([])
const loading = ref(true)
const lookupCode = ref('')
const lookupError = ref('')

onMounted(async () => {
  auth.restore()
  if (!auth.user) {
    router.push('/login')
    return
  }
  try {
    programs.value = await request<Program[]>('/programs', { auth: true })
  } finally {
    loading.value = false
  }
})

async function goToLookup() {
  if (!lookupCode.value.trim()) return
  lookupError.value = ''
  try {
    const member = await request<{ id: string }>(`/members/lookup/${lookupCode.value.trim()}`, { auth: true })
    router.push(`/members/${member.id}`)
  } catch (e) {
    lookupError.value = 'Aucun client trouve avec ce code.'
  }
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-14">
    <div class="mb-10 flex flex-wrap items-center justify-between gap-4">
      <h1 class="font-display text-3xl italic text-paper">Mon espace</h1>
      <NuxtLink to="/programs/new" class="rounded-full bg-brass px-5 py-2.5 text-sm font-bold text-ink">
        + Nouveau programme
      </NuxtLink>
    </div>

    <div class="mb-12 rounded-2xl border border-paper/10 bg-paper/5 p-6">
      <p class="mb-3 font-body text-sm font-medium text-paper/80">Tamponner un client</p>
      <div class="flex gap-2">
        <input
          v-model="lookupCode"
          type="text"
          placeholder="Code client (ex: 7K2P9QX)"
          class="focus-ring flex-1 rounded-xl border border-paper/15 bg-paper/5 px-4 py-2.5 font-mono text-sm uppercase text-paper placeholder:text-paper/30"
          @keyup.enter="goToLookup"
        />
        <button class="focus-ring rounded-xl bg-brass px-5 py-2.5 text-sm font-bold text-ink" @click="goToLookup">
          Chercher
        </button>
      </div>
      <p v-if="lookupError" class="mt-2 text-xs text-stamp">{{ lookupError }}</p>
    </div>

    <div v-if="loading" class="text-paper/60">Chargement...</div>

    <div v-else-if="!programs.length" class="rounded-2xl border border-paper/10 bg-paper/5 p-12 text-center">
      <p class="text-paper/60">Tu n'as pas encore de programme de fidelite.</p>
      <NuxtLink to="/programs/new" class="mt-3 inline-block text-sm text-brass underline">Creer mon premier programme</NuxtLink>
    </div>

    <div v-else class="grid gap-5 md:grid-cols-2">
      <NuxtLink
        v-for="p in programs"
        :key="p.id"
        :to="`/programs/${p.id}`"
        class="rounded-2xl border border-paper/10 bg-paper/5 p-6 transition hover:border-brass/40"
      >
        <p class="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/40">{{ p.stampsRequired }} tampons</p>
        <h3 class="mt-1 font-display text-2xl italic text-paper">{{ p.name }}</h3>
        <p class="mt-1 text-sm text-paper/60">{{ p.rewardDescription }}</p>
      </NuxtLink>
    </div>
  </main>
</template>
