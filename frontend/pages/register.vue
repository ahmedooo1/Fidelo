<script setup lang="ts">
const { request } = useApi()
const auth = useAuthStore()
const router = useRouter()

const businessName = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await request<{ accessToken: string; user: any }>('/auth/register', {
      method: 'POST',
      body: { businessName: businessName.value, email: email.value, password: password.value },
    })
    auth.setSession(res.accessToken, res.user)
    router.push('/dashboard')
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Inscription impossible pour le moment.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
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
    <p class="mt-6 text-center text-sm text-paper/60">
      Déjà inscrit ? <NuxtLink to="/login" class="text-brass underline">Connecte-toi</NuxtLink>
    </p>
  </main>
</template>
