<script setup lang="ts">
const { request } = useApi()
const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)
const needsVerification = ref(false)
const resendState = ref<'idle' | 'sending' | 'sent'>('idle')

async function submit() {
  loading.value = true
  errorMsg.value = ''
  needsVerification.value = false
  resendState.value = 'idle'
  try {
    const res = await request<{ accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    auth.setSession(res.accessToken, res.user)
    router.push('/dashboard')
  } catch (e: any) {
    if (e?.data?.message === 'EMAIL_NOT_VERIFIED') {
      needsVerification.value = true
    } else {
      errorMsg.value = 'Email ou mot de passe incorrect.'
    }
  } finally {
    loading.value = false
  }
}

async function resendVerification() {
  resendState.value = 'sending'
  try {
    await request('/auth/resend-verification', { method: 'POST', body: { email: email.value } })
  } finally {
    resendState.value = 'sent'
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
    <h1 class="font-display text-3xl italic text-paper">Content de te revoir</h1>
    <form class="mt-8 space-y-4" @submit.prevent="submit">
      <div>
        <label class="mb-1.5 block text-sm text-paper/80">Email</label>
        <input v-model="email" type="email" required class="focus-ring w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-3 text-paper" />
      </div>
      <div>
        <label class="mb-1.5 block text-sm text-paper/80">Mot de passe</label>
        <input v-model="password" type="password" required class="focus-ring w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-3 text-paper" />
      </div>
      <p v-if="errorMsg" class="text-sm text-stamp">{{ errorMsg }}</p>
      <div v-if="needsVerification" class="rounded-xl border border-brass/30 bg-brass/10 p-3 text-sm text-paper/80">
        <p>Confirme ton adresse email avant de te connecter (vérifie tes spams).</p>
        <button
          type="button"
          :disabled="resendState !== 'idle'"
          class="mt-1.5 font-medium text-brass underline disabled:no-underline disabled:opacity-60"
          @click="resendVerification"
        >
          {{ resendState === 'sent' ? 'Email renvoyé ✓' : resendState === 'sending' ? 'Envoi…' : "Renvoyer l'email de confirmation" }}
        </button>
      </div>
      <button type="submit" :disabled="loading" class="focus-ring w-full rounded-full bg-brass px-6 py-3.5 font-bold text-ink disabled:opacity-60">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
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
      Pas encore de compte ? <NuxtLink to="/register" class="text-brass underline">Inscris-toi</NuxtLink>
    </p>
  </main>
</template>
