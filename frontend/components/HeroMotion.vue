<script setup lang="ts">
import QRCode from 'qrcode'

/**
 * Animation du hero (15 s en boucle) : le commerçant tamponne la carte du
 * client depuis son espace, la carte se remplit sur le téléphone du client,
 * la récompense se débloque puis est utilisée.
 * En pause hors de l'écran ; figée sur la récompense si l'utilisateur
 * préfère réduire les animations. Un clic sur la carte tamponne à la main.
 */
const LOOP = 15
const REQUIRED = 8
const START = 5
const PRESSES = [2.6, 5.1, 7.6] // +1 tampon
const REDEEM = 11.8 // utiliser la récompense
const CODE = 'A7K2'

const t = ref(9)
const root = ref<HTMLElement>()
let frame = 0
let origin = 0
let visible = true
let resumeTimer: ReturnType<typeof setTimeout> | undefined

// Mode manuel : le visiteur tamponne lui-même, l'animation reprend après.
const manual = ref<number | null>(null)
const manualBurst = ref(0)

function tick(now: number) {
  if (!origin) origin = now - t.value * 1000
  t.value = ((now - origin) / 1000) % LOOP
  frame = requestAnimationFrame(tick)
}
function play() {
  if (frame || manual.value !== null || !visible) return
  origin = 0
  frame = requestAnimationFrame(tick)
}
function pause() {
  cancelAnimationFrame(frame)
  frame = 0
}

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  t.value = 0
  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    visible ? play() : pause()
  })
  io.observe(root.value!)
  const onVisibility = () => (document.hidden ? pause() : play())
  document.addEventListener('visibilitychange', onVisibility)
  onBeforeUnmount(() => {
    pause()
    io.disconnect()
    clearTimeout(resumeTimer)
    document.removeEventListener('visibilitychange', onVisibility)
  })
})

function stampByHand() {
  pause()
  const current = manual.value ?? stamps.value
  manual.value = current >= REQUIRED ? 0 : current + 1
  if (manual.value === REQUIRED) manualBurst.value++
  clearTimeout(resumeTimer)
  resumeTimer = setTimeout(() => {
    manual.value = null
    t.value = 0
    play()
  }, 6000)
}

const between = (a: number, b: number) => t.value >= a && t.value < b

// État de la scène à l'instant t.
const autoStamps = computed(() => {
  if (t.value >= REDEEM + 0.4) return 0
  return START + PRESSES.filter((p) => t.value >= p).length
})
const stamps = computed(() => manual.value ?? autoStamps.value)
const rewardReady = computed(() => stamps.value === REQUIRED)
const rewardUsed = computed(() => manual.value === null && between(REDEEM + 0.4, LOOP))
const burstKey = computed(() => (manual.value !== null ? `m${manualBurst.value}` : t.value >= PRESSES[2]! && t.value < PRESSES[2]! + 1 ? 'auto' : ''))

// Fondu de fin de boucle pour repartir de 5 tampons sans à-coup.
const opacity = computed(() => {
  if (manual.value !== null) return 1
  if (t.value > LOOP - 0.8) return Math.max(0, Math.round(((LOOP - t.value) / 0.8) * 100) / 100)
  if (t.value < 0.5) return Math.round((t.value / 0.5) * 100) / 100
  return 1
})

const typed = computed(() => (manual.value !== null ? CODE : CODE.slice(0, Math.max(0, Math.min(CODE.length, Math.floor((t.value - 0.6) / 0.28) + 1)))))
const found = computed(() => manual.value !== null || t.value >= 1.9)
const redeemMode = computed(() => manual.value === null && between(9.4, REDEEM + 1.8))
const pressing = computed(() => manual.value === null && [...PRESSES, REDEEM].some((p) => between(p - 0.12, p + 0.22)))
const toast = computed(() => {
  if (manual.value !== null) return ''
  if (between(PRESSES[2]!, PRESSES[2]! + 1.6)) return 'Récompense débloquée'
  if (PRESSES.some((p) => between(p, p + 1.3))) return 'Tampon ajouté'
  if (between(REDEEM + 0.1, REDEEM + 1.8)) return 'Récompense utilisée'
  return ''
})
const notify = computed(() => manual.value === null && between(PRESSES[2]! + 0.5, PRESSES[2]! + 3.2))

const burstBits = Array.from({ length: 14 }, (_, i) => {
  const angle = (360 / 14) * i
  const dist = 60 + ((i * 37) % 36)
  return {
    tx: `${Math.cos((angle * Math.PI) / 180) * dist}px`,
    ty: `${Math.sin((angle * Math.PI) / 180) * dist}px`,
    delay: `${(i % 5) * 25}ms`,
  }
})

// Vrai QR code (il mène au site), généré dans le navigateur.
const qr = ref('')
onMounted(async () => {
  qr.value = await QRCode.toString('https://fidelo.aaweb.fr', { type: 'svg', margin: 0, color: { dark: '#122325', light: '#F5EFE0' } })
})
</script>

<template>
  <div ref="root" class="relative mx-auto h-[470px] w-full max-w-[350px] select-none" :style="{ opacity }">
    <!-- Téléphone du client -->
    <div class="absolute left-0 top-0 h-[440px] w-[236px] rounded-[2.4rem] border-[7px] border-[#07191a] bg-passport-dark shadow-2xl ring-1 ring-paper/10">
      <div class="absolute left-1/2 top-2 h-4 w-20 -translate-x-1/2 rounded-full bg-[#07191a]" />

      <div class="relative h-full overflow-hidden rounded-[1.9rem] px-3 pt-9">
        <!-- Notification -->
        <div
          class="absolute inset-x-2 top-2 z-20 rounded-2xl bg-paper/95 px-3 py-2 text-ink shadow-lg transition-all duration-500"
          :class="notify ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0'"
        >
          <p class="font-body text-[11px] font-semibold">Café des Artisans</p>
          <p class="font-body text-[11px] text-ink/70">Votre café est offert au prochain passage</p>
        </div>

        <p class="px-1 font-body text-xs text-paper/60">Ma carte</p>

        <button
          type="button"
          class="relative mt-2 block w-full rounded-2xl bg-paper p-4 text-left text-ink shadow-xl transition active:scale-[0.97]"
          aria-label="Tamponner la carte de démonstration"
          @click="stampByHand"
        >
          <p class="font-display text-xl italic leading-tight text-passport">Café des Artisans</p>
          <div class="mt-3 grid grid-cols-4 gap-2">
            <span
              v-for="i in REQUIRED"
              :key="i"
              class="relative flex aspect-square items-center justify-center rounded-full border-2"
              :class="i <= stamps ? 'border-stamp' : 'border-dashed border-ink/25'"
            >
              <svg v-if="i <= stamps" viewBox="0 0 40 40" class="absolute inset-0 h-full w-full animate-stampIn text-stamp">
                <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="2.5" />
                <path d="M12 21l5 5 11-12" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span v-else class="font-mono text-[10px] text-ink/30">{{ i }}</span>
            </span>
          </div>
          <div class="mt-3 min-h-[40px]">
            <p v-if="rewardReady" class="flex items-center gap-2 rounded-xl bg-brass/15 px-3 py-2 font-body text-xs font-semibold text-passport">
              <svg width="16" height="16" viewBox="0 0 24 24" class="shrink-0 text-brass"><path d="M12 2l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" fill="currentColor" /></svg>
              1 café offert
            </p>
            <p v-else-if="rewardUsed" class="px-1 py-2 font-body text-xs text-ink/60">Récompense utilisée, merci !</p>
            <p v-else class="px-1 py-2 font-body text-xs text-ink/60">Encore {{ REQUIRED - stamps }} avant 1 café offert</p>
          </div>

          <!-- Confettis -->
          <span v-if="burstKey" :key="burstKey" class="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              v-for="(b, i) in burstBits"
              :key="i"
              class="absolute h-2 w-2 rounded-full"
              :class="i % 3 ? 'bg-brass' : 'bg-stamp'"
              :style="{ '--tx': b.tx, '--ty': b.ty, animation: `hero-burst 0.9s ease-out ${b.delay} forwards` }"
            />
          </span>
        </button>

        <div class="mt-4 flex items-center gap-3 rounded-2xl bg-paper/[0.06] p-3">
          <div class="h-14 w-14 shrink-0 rounded-md bg-paper p-1 [&>svg]:h-full [&>svg]:w-full" v-html="qr" />
          <div class="min-w-0">
            <p class="font-body text-[11px] text-paper/50">Code client</p>
            <p class="font-mono text-base font-semibold tracking-widest text-paper">{{ CODE }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Espace du commerçant -->
    <div class="absolute bottom-0 right-0 w-[196px] rounded-2xl bg-paper p-4 text-ink shadow-2xl ring-1 ring-ink/10">
      <p class="font-body text-xs font-semibold text-passport">Espace commerçant</p>
      <div class="mt-2 flex h-9 items-center rounded-lg border border-ink/15 bg-white px-2.5 font-mono text-sm tracking-widest">
        <span>{{ typed }}</span>
        <span v-if="!found" class="ml-px h-4 w-px animate-pulse bg-ink" />
        <span v-if="!typed" class="font-body text-xs tracking-normal text-ink/40">Code client</span>
      </div>
      <div class="mt-3 flex items-center justify-between font-body text-xs transition-opacity duration-300" :class="found ? 'opacity-100' : 'opacity-0'">
        <span class="text-ink/60">Carte {{ CODE }}</span>
        <span class="font-semibold tabular-nums">{{ stamps }} / {{ REQUIRED }}</span>
      </div>
      <div
        class="relative mt-2 flex h-10 items-center justify-center overflow-hidden rounded-full font-body text-sm font-bold transition-all duration-200"
        :class="[redeemMode ? 'bg-brass text-ink' : 'bg-passport text-paper', pressing ? 'scale-95' : 'scale-100', found ? 'opacity-100' : 'opacity-40']"
      >
        {{ redeemMode ? 'Utiliser la récompense' : '+1 tampon' }}
        <span v-if="pressing" class="absolute h-16 w-16 animate-ping rounded-full bg-paper/30" />
      </div>
      <p class="mt-2 h-4 text-center font-body text-[11px] font-semibold transition-opacity duration-300" :class="[toast ? 'opacity-100' : 'opacity-0', toast === 'Récompense débloquée' ? 'text-brass' : 'text-passport-light']">
        {{ toast || '\u00a0' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes hero-burst {
  0% { transform: translate(0, 0) scale(0.6); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
}
</style>
