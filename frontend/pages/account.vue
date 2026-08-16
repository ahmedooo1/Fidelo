<script setup lang="ts">
const { request } = useApi()
const auth = useAuthStore()
const router = useRouter()

const businessName = ref('')
const profileSaving = ref(false)
const profileMsg = ref('')
const profileError = ref('')

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordSaving = ref(false)
const passwordMsg = ref('')
const passwordError = ref('')

onMounted(() => {
  auth.restore()
  if (!auth.user) {
    router.push('/login')
    return
  }
  businessName.value = auth.user.businessName
})

async function saveProfile() {
  profileSaving.value = true
  profileMsg.value = ''
  profileError.value = ''
  try {
    const user = await request<{ id: string; email: string; businessName: string }>('/users/me', {
      method: 'PATCH',
      auth: true,
      body: { businessName: businessName.value },
    })
    auth.setSession(auth.token!, user)
    profileMsg.value = 'Nom du commerce mis a jour.'
  } catch (e) {
    profileError.value = "La mise a jour a echoue."
  } finally {
    profileSaving.value = false
  }
}

async function savePassword() {
  passwordMsg.value = ''
  passwordError.value = ''
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Les deux mots de passe ne correspondent pas.'
    return
  }
  passwordSaving.value = true
  try {
    await request('/users/me/password', {
      method: 'PATCH',
      auth: true,
      body: { currentPassword: currentPassword.value, newPassword: newPassword.value },
    })
    passwordMsg.value = 'Mot de passe modifie.'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (e: any) {
    passwordError.value = e?.data?.message || 'Le mot de passe actuel est incorrect.'
  } finally {
    passwordSaving.value = false
  }
}

function doLogout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <main class="mx-auto max-w-2xl px-6 py-14">
    <h1 class="font-display text-3xl italic text-paper">Mon compte</h1>
    <p class="mt-2 text-sm text-paper/60">{{ auth.user?.email }}</p>

    <section class="mt-10 rounded-2xl border border-paper/10 bg-paper/5 p-6">
      <h2 class="font-display text-xl italic text-paper">Nom du commerce</h2>
      <form class="mt-4 flex flex-col gap-3 sm:flex-row" @submit.prevent="saveProfile">
        <input
          v-model="businessName"
          type="text"
          required
          class="focus-ring flex-1 rounded-xl border border-paper/15 bg-paper/5 px-4 py-2.5 text-paper"
        />
        <button
          type="submit"
          :disabled="profileSaving"
          class="focus-ring rounded-xl bg-brass px-5 py-2.5 text-sm font-bold text-ink disabled:opacity-60"
        >
          {{ profileSaving ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </form>
      <p v-if="profileMsg" class="mt-2 text-xs text-brass">{{ profileMsg }}</p>
      <p v-if="profileError" class="mt-2 text-xs text-stamp">{{ profileError }}</p>
    </section>

    <section class="mt-6 rounded-2xl border border-paper/10 bg-paper/5 p-6">
      <h2 class="font-display text-xl italic text-paper">Changer de mot de passe</h2>
      <form class="mt-4 space-y-3" @submit.prevent="savePassword">
        <input
          v-model="currentPassword"
          type="password"
          required
          placeholder="Mot de passe actuel"
          class="focus-ring w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-2.5 text-paper placeholder:text-paper/30"
        />
        <input
          v-model="newPassword"
          type="password"
          required
          minlength="8"
          placeholder="Nouveau mot de passe"
          class="focus-ring w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-2.5 text-paper placeholder:text-paper/30"
        />
        <input
          v-model="confirmPassword"
          type="password"
          required
          minlength="8"
          placeholder="Confirmer le nouveau mot de passe"
          class="focus-ring w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-2.5 text-paper placeholder:text-paper/30"
        />
        <button
          type="submit"
          :disabled="passwordSaving"
          class="focus-ring rounded-xl bg-brass px-5 py-2.5 text-sm font-bold text-ink disabled:opacity-60"
        >
          {{ passwordSaving ? 'Enregistrement...' : 'Changer le mot de passe' }}
        </button>
      </form>
      <p v-if="passwordMsg" class="mt-2 text-xs text-brass">{{ passwordMsg }}</p>
      <p v-if="passwordError" class="mt-2 text-xs text-stamp">{{ passwordError }}</p>
    </section>

    <button
      type="button"
      class="focus-ring mt-8 text-sm text-paper/50 underline-offset-4 hover:text-paper hover:underline"
      @click="doLogout"
    >
      Se deconnecter
    </button>
  </main>
</template>
