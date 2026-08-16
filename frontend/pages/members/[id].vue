<script setup lang="ts">
interface Member {
  id: string
  code: string
  name: string
  contact: string
  currentStamps: number
  rewardsAvailable: number
  rewardsRedeemed: number
  program: { name: string; stampsRequired: number; rewardDescription: string }
}

const route = useRoute()
const { request } = useApi()

const member = ref<Member | null>(null)
const loading = ref(true)
const busy = ref(false)
const errorMsg = ref('')
const cardUrl = ref('')

const sending = ref(false)
const sendMsg = ref('')
const sendError = ref('')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const hasEmailContact = computed(() => !!member.value?.contact && EMAIL_RE.test(member.value.contact))

// L'API expose /members/lookup/:code et /members/mine mais pas /members/:id en lecture seule,
// donc pour cette page de detail on recupere la liste et on filtre par id.
async function loadById() {
  loading.value = true
  try {
    const all = await request<Member[]>('/members/mine', { auth: true })
    member.value = all.find((m) => m.id === route.params.id) || null
    if (member.value && import.meta.client) {
      cardUrl.value = `${window.location.origin}/card/${member.value.code}`
    }
  } finally {
    loading.value = false
  }
}
onMounted(loadById)

async function stamp() {
  if (!member.value) return
  busy.value = true
  errorMsg.value = ''
  try {
    member.value = await request<Member>(`/members/${member.value.id}/stamp`, { method: 'POST', auth: true })
  } catch (e) {
    errorMsg.value = 'Impossible d ajouter le tampon.'
  } finally {
    busy.value = false
  }
}

async function redeem() {
  if (!member.value) return
  busy.value = true
  errorMsg.value = ''
  try {
    member.value = await request<Member>(`/members/${member.value.id}/redeem`, { method: 'POST', auth: true })
  } catch (e) {
    errorMsg.value = 'Aucune recompense disponible.'
  } finally {
    busy.value = false
  }
}

function copyLink() {
  navigator.clipboard?.writeText(cardUrl.value)
}

async function sendByEmail() {
  if (!member.value) return
  sending.value = true
  sendMsg.value = ''
  sendError.value = ''
  try {
    await request(`/members/${member.value.id}/send-card`, { method: 'POST', auth: true })
    sendMsg.value = `Carte envoyee a ${member.value.contact}.`
  } catch (e: any) {
    sendError.value = e?.data?.message || "L'envoi a echoue."
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-2xl px-6 py-14">
    <div v-if="loading" class="text-paper/60">Chargement...</div>

    <template v-else-if="member">
      <p class="font-mono text-xs uppercase tracking-[0.15em] text-paper/40">Code {{ member.code }}</p>
      <h1 class="mt-1 font-display text-3xl italic text-paper">{{ member.name || 'Client sans nom' }}</h1>
      <p v-if="member.contact" class="text-sm text-paper/60">{{ member.contact }}</p>

      <div class="mt-8 max-w-sm">
        <StampCard
          :program-name="member.program.name"
          :stamps-required="member.program.stampsRequired"
          :current-stamps="member.currentStamps"
          :rewards-available="member.rewardsAvailable"
          :reward-description="member.program.rewardDescription"
        />
      </div>

      <div class="mt-6 flex flex-wrap gap-3">
        <button :disabled="busy" class="focus-ring rounded-full bg-brass px-6 py-3 text-sm font-bold text-ink disabled:opacity-60" @click="stamp">
          + Ajouter un tampon
        </button>
        <button
          v-if="member.rewardsAvailable > 0"
          :disabled="busy"
          class="focus-ring rounded-full border border-brass/50 px-6 py-3 text-sm font-bold text-brass disabled:opacity-60"
          @click="redeem"
        >
          Utiliser la recompense
        </button>
      </div>
      <p v-if="errorMsg" class="mt-3 text-sm text-stamp">{{ errorMsg }}</p>

      <div class="mt-8 rounded-2xl border border-paper/10 bg-paper/5 p-5">
        <p class="text-sm text-paper/70">Lien de la carte a envoyer au client :</p>
        <div class="mt-2 flex items-center gap-2">
          <code class="flex-1 truncate rounded-lg bg-paper/10 px-3 py-2 font-mono text-xs text-paper/80">{{ cardUrl }}</code>
          <button class="focus-ring rounded-lg bg-paper/10 px-3 py-2 text-xs text-paper/80" @click="copyLink">Copier</button>
        </div>

        <div class="mt-4 border-t border-paper/10 pt-4">
          <button
            v-if="hasEmailContact"
            :disabled="sending"
            class="focus-ring rounded-lg bg-brass px-4 py-2.5 text-xs font-bold text-ink disabled:opacity-60"
            @click="sendByEmail"
          >
            {{ sending ? 'Envoi...' : `Envoyer par email a ${member.contact}` }}
          </button>
          <p v-else class="text-xs text-paper/40">
            Ajoute une adresse email valide en contact du client pour pouvoir lui envoyer sa carte par mail.
          </p>
          <p v-if="sendMsg" class="mt-2 text-xs text-brass">{{ sendMsg }}</p>
          <p v-if="sendError" class="mt-2 text-xs text-stamp">{{ sendError }}</p>
        </div>
      </div>
    </template>

    <div v-else class="text-paper/60">Client introuvable.</div>
  </main>
</template>
