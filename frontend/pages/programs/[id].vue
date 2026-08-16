<script setup lang="ts">
interface Program {
  id: string
  name: string
  stampsRequired: number
  rewardDescription: string
}
interface Member {
  id: string
  code: string
  name: string
  currentStamps: number
  rewardsAvailable: number
}

const route = useRoute()
const { request } = useApi()

const program = ref<Program | null>(null)
const members = ref<Member[]>([])
const loading = ref(true)
const newName = ref('')
const newContact = ref('')
const adding = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function load() {
  loading.value = true
  try {
    program.value = await request<Program>(`/programs/${route.params.id}`, { auth: true })
    members.value = await request<Member[]>(`/members/mine?programId=${route.params.id}`, { auth: true })
  } finally {
    loading.value = false
  }
}
onMounted(load)

async function addMember() {
  adding.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const created = await request<Member & { contact: string }>('/members', {
      method: 'POST',
      auth: true,
      body: { programId: route.params.id, name: newName.value, contact: newContact.value },
    })
    const contact = newContact.value
    newName.value = ''
    newContact.value = ''
    await load()

    if (contact && EMAIL_RE.test(contact)) {
      try {
        await request(`/members/${created.id}/send-card`, { method: 'POST', auth: true })
        successMsg.value = `Client ajouté, carte envoyée par email à ${contact}.`
      } catch (e) {
        successMsg.value = 'Client ajouté, mais l\'envoi de la carte par email a échoué.'
      }
    } else {
      successMsg.value = 'Client ajouté.'
    }
  } catch (e) {
    errorMsg.value = "L'ajout a échoué."
  } finally {
    adding.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-4xl px-6 py-14">
    <div v-if="loading" class="text-paper/60">Chargement...</div>

    <template v-else-if="program">
      <p class="font-mono text-xs uppercase tracking-[0.15em] text-brass">{{ program.stampsRequired }} tampons</p>
      <h1 class="mt-1 font-display text-3xl italic text-paper">{{ program.name }}</h1>
      <p class="mt-1 text-sm text-paper/60">{{ program.rewardDescription }}</p>

      <div class="mt-10 rounded-2xl border border-paper/10 bg-paper/5 p-6">
        <p class="mb-3 text-sm font-medium text-paper/80">Inscrire un client</p>
        <div class="grid gap-3 sm:grid-cols-3">
          <input v-model="newName" type="text" placeholder="Nom (optionnel)" class="focus-ring rounded-xl border border-paper/15 bg-paper/5 px-4 py-2.5 text-paper sm:col-span-1" />
          <input v-model="newContact" type="text" placeholder="Téléphone / email (optionnel)" class="focus-ring rounded-xl border border-paper/15 bg-paper/5 px-4 py-2.5 text-paper sm:col-span-1" />
          <button :disabled="adding" class="focus-ring rounded-xl bg-brass px-4 py-2.5 text-sm font-bold text-ink sm:col-span-1" @click="addMember">
            {{ adding ? 'Ajout...' : 'Ajouter' }}
          </button>
        </div>
        <p v-if="errorMsg" class="mt-2 text-xs text-stamp">{{ errorMsg }}</p>
        <p v-if="successMsg" class="mt-2 text-xs text-brass">{{ successMsg }}</p>
      </div>

      <h2 class="mb-4 mt-10 font-display text-xl italic text-paper">Clients ({{ members.length }})</h2>
      <div v-if="!members.length" class="rounded-2xl border border-paper/10 bg-paper/5 p-8 text-center text-sm text-paper/50">
        Aucun client inscrit pour l'instant.
      </div>
      <div v-else class="divide-y divide-paper/10 rounded-2xl border border-paper/10">
        <NuxtLink
          v-for="m in members"
          :key="m.id"
          :to="`/members/${m.id}`"
          class="flex items-center justify-between px-5 py-4 transition hover:bg-paper/5"
        >
          <div>
            <p class="text-paper">{{ m.name || 'Client sans nom' }}</p>
            <p class="font-mono text-xs uppercase text-paper/40">{{ m.code }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-paper/70">{{ m.currentStamps }} / {{ program.stampsRequired }}</p>
            <p v-if="m.rewardsAvailable" class="text-xs font-medium text-brass">Récompense prête</p>
          </div>
        </NuxtLink>
      </div>
    </template>
  </main>
</template>
