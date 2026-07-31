<script setup lang="ts">
import QRCode from 'qrcode'

interface Member {
  code: string
  name: string
  currentStamps: number
  rewardsAvailable: number
  program: { name: string; stampsRequired: number; rewardDescription: string }
}

const route = useRoute()
const { request } = useApi()

const member = ref<Member | null>(null)
const loading = ref(true)
const notFound = ref(false)
const qrDataUrl = ref('')

onMounted(async () => {
  try {
    member.value = await request<Member>(`/members/public/${route.params.code}`)
    if (import.meta.client) {
      const url = `${window.location.origin}/card/${member.value.code}`
      qrDataUrl.value = await QRCode.toDataURL(url, {
        margin: 1,
        color: { dark: '#0F3D3E', light: '#F5EFE0' },
      })
    }
  } catch (e) {
    notFound.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
    <div v-if="loading" class="text-paper/60">Ouverture de la carte...</div>

    <div v-else-if="notFound" class="space-y-4">
      <p class="font-display text-2xl italic text-paper">Cette carte n'existe pas</p>
      <NuxtLink to="/" class="text-sm text-brass underline">Retour a l'accueil</NuxtLink>
    </div>

    <div v-else-if="member" class="w-full">
      <StampCard
        :program-name="member.program.name"
        :stamps-required="member.program.stampsRequired"
        :current-stamps="member.currentStamps"
        :rewards-available="member.rewardsAvailable"
        :reward-description="member.program.rewardDescription"
      />

      <div v-if="qrDataUrl" class="mt-8 flex flex-col items-center gap-2">
        <img :src="qrDataUrl" alt="QR code de la carte" class="h-36 w-36 rounded-xl border border-paper/15" />
        <p class="font-mono text-xs uppercase tracking-[0.15em] text-paper/40">{{ member.code }}</p>
        <p class="text-xs text-paper/50">Montre ce code ou ce QR au commerce pour recevoir un tampon</p>
      </div>
    </div>
  </main>
</template>
