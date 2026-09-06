<script setup lang="ts">
const { request } = useApi()
const auth = useAuthStore()
const router = useRouter()

const businessName = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)
const registeredEmail = ref('')

async function submit() {
  loading.value = true
  errorMsg.value = ''
  try {
    await request<{ requiresVerification: boolean; email: string }>('/auth/register', {
      method: 'POST',
      body: { businessName: businessName.value, email: email.value, password: password.value },
    })
    registeredEmail.value = email.value
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Inscription impossible pour le moment.'
  } finally {
    loading.value = false
  }
}

function onGoogleSuccess(session: { accessToken: string; user: any }) {
  auth.setSession(session.accessToken, session.user)
  router.push('/dashboard')
}

function onGoogleError(message: string) {
  errorMsg.value = message
}
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
    <template v-if="registeredEmail">
      <div class="rounded-2xl border border-paper/15 bg-paper/5 p-7 text-center">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brass/20 text-2xl">
          ✉️
        </div>
        <h1 class="mt-4 font-display text-xl italic text-paper">Vérifie ta boîte mail</h1>
        <p class="mt-2 text-sm text-paper/70">
          On a envoyé un lien de confirmation à <strong>{{ registeredEmail }}</strong>. Clique
          dessus pour activer ton compte, puis connecte-toi.
        </p>
        <NuxtLink
          to="/login"
          class="mt-6 inline-block rounded-full bg-brass px-6 py-2.5 font-bold text-ink"
        >
          Aller à la connexion
        </NuxtLink>
      </div>
    </template>
    <template v-else>
      <h1 class="font-display text-3xl italic text-paper">Crée ton compte</h1>
      <p class="mt-2 text-sm text-paper/60">Gratuit, en moins d'une minute.</p>
      <form class="mt-8 space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-1.5 block text-sm text-paper/80">Nom du commerce</label>
          <input v-model="businessName" type="text" required class="focus-ring w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-3 text-paper" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm text-paper/80">Email</label>
          <input v-model="email" type="email" required class="focus-ring w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-3 text-paper" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm text-paper/80">Mot de passe</label>
          <input v-model="password" type="password" required minlength="8" class="focus-ring w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-3 text-paper" />
        </div>
        <p v-if="errorMsg" class="text-sm text-stamp">{{ errorMsg }}</p>
        <button type="submit" :disabled="loading" class="focus-ring w-full rounded-full bg-brass px-6 py-3.5 font-bold text-ink disabled:opacity-60">
          {{ loading ? 'Création...' : 'Créer mon compte' }}
        </button>
      </form>
      <div class="my-6 flex items-center gap-3">
        <div class="h-px flex-1 bg-paper/15"></div>
        <span class="text-xs uppercase tracking-wide text-paper/40">ou</span>
        <div class="h-px flex-1 bg-paper/15"></div>
      </div>
      <div class="flex justify-center">
        <GoogleSignInButton @success="onGoogleSuccess" @error="onGoogleError" />
      </div>
      <p class="mt-6 text-center text-sm text-paper/60">
        Déjà inscrit ? <NuxtLink to="/login" class="text-brass underline">Connecte-toi</NuxtLink>
      </p>
    </template>
  </main>
</template>
