<script setup lang="ts">
const { request } = useApi()
const router = useRouter()

const name = ref('')
const stampsRequired = ref(8)
const rewardDescription = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  errorMsg.value = ''
  try {
    const program = await request<{ id: string }>('/programs', {
      method: 'POST',
      auth: true,
      body: {
        name: name.value,
        stampsRequired: Number(stampsRequired.value),
        rewardDescription: rewardDescription.value,
      },
    })
    router.push(`/programs/${program.id}`)
  } catch (e) {
    errorMsg.value = "La création a échoué. Vérifie les champs et réessaie."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-xl px-6 py-14">
    <h1 class="font-display text-3xl italic text-paper">Nouveau programme</h1>
    <p class="mt-2 text-sm text-paper/60">Définis la règle de fidélité de ton commerce.</p>

    <form class="mt-8 space-y-5" @submit.prevent="submit">
      <div>
        <label class="mb-1.5 block text-sm text-paper/80">Nom du programme</label>
        <input v-model="name" required type="text" placeholder="Café des Artisans" class="focus-ring w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-3 text-paper" />
      </div>
      <div>
        <label class="mb-1.5 block text-sm text-paper/80">Nombre de tampons requis</label>
        <input v-model="stampsRequired" required type="number" min="2" max="30" class="focus-ring w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-3 text-paper" />
      </div>
      <div>
        <label class="mb-1.5 block text-sm text-paper/80">Récompense</label>
        <input v-model="rewardDescription" required type="text" placeholder="1 café offert" class="focus-ring w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-3 text-paper" />
      </div>
      <p v-if="errorMsg" class="text-sm text-stamp">{{ errorMsg }}</p>
      <button type="submit" :disabled="loading" class="focus-ring w-full rounded-full bg-brass px-6 py-3.5 font-bold text-ink disabled:opacity-60 sm:w-auto">
        {{ loading ? 'Création...' : 'Créer le programme' }}
      </button>
    </form>
  </main>
</template>
