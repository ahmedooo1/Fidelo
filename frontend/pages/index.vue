<script setup lang="ts">
const stampsRequired = 8
const currentStamps = ref(5)
const justRewarded = ref(false)
const burstKey = ref(0)

function simulateStamp() {
  if (currentStamps.value < stampsRequired) {
    currentStamps.value++
    if (currentStamps.value === stampsRequired) {
      justRewarded.value = true
      burstKey.value++
      setTimeout(() => (justRewarded.value = false), 1200)
    }
  } else {
    currentStamps.value = 0
  }
}

const burstBits = computed(() =>
  Array.from({ length: 14 }, (_, i) => {
    const angle = (360 / 14) * i + (i % 2 === 0 ? 6 : -6)
    const dist = 70 + ((i * 37) % 40)
    return {
      tx: `${Math.cos((angle * Math.PI) / 180) * dist}px`,
      ty: `${Math.sin((angle * Math.PI) / 180) * dist}px`,
      delay: `${(i % 5) * 25}ms`,
    }
  }),
)

const timeline = [
  {
    tag: 'Etape 1',
    title: 'Cree ton programme',
    text: 'Choisis le nombre de tampons et la recompense : "1 cafe offert au 8e", "-20% au 10e passage"... Pret en 2 minutes.',
  },
  {
    tag: 'Etape 2',
    title: 'Inscris tes clients',
    text: 'Chaque client recoit un code unique et une carte digitale accessible par lien direct, sans application a installer.',
  },
  {
    tag: 'Etape 3',
    title: 'Tamponne a chaque visite',
    text: 'Depuis ton espace, cherche le code du client et ajoute un tampon en un clic. La recompense se declenche automatiquement.',
  },
]

const rewardTicker = [
  '1 cafe offert au 8e',
  '-20% des le 10e passage',
  'Coupe gratuite au 6e',
  '1 dessert offert',
  'Seance offerte au 10e',
  'Livre offert au 5e achat',
  '-15% sur la prochaine visite',
  'Massage offert au 8e',
]

const businessTypes = [
  { label: 'Cafe', icon: 'cup' },
  { label: 'Coiffeur', icon: 'scissors' },
  { label: 'Restaurant', icon: 'plate' },
  { label: 'Institut beaute', icon: 'sparkle' },
  { label: 'Salle de sport', icon: 'dumbbell' },
  { label: 'Librairie', icon: 'book' },
]
</script>

<template>
  <main class="overflow-x-clip">
    <!-- HERO -->
    <section class="grain relative border-b border-paper/10 pb-28 pt-16 md:pt-24">
      <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(201,162,39,0.14),transparent)]" />

      <div class="relative z-10 mx-auto flex max-w-6xl min-w-0 flex-col items-center gap-16 px-6 md:flex-row">
        <div class="min-w-0 max-w-xl text-center md:text-left" v-reveal>
          <span class="mb-5 inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/60">
            <span class="h-1.5 w-1.5 rounded-full bg-brass" />
            Fidelite digitale &middot; sans papier, sans app
          </span>
          <h1 class="font-display text-5xl italic leading-[1.05] text-paper md:text-6xl">
            La carte de fidelite <span class="text-brass underline decoration-wavy decoration-2 underline-offset-8 decoration-brass/50">de votre commerce</span>, en digital
          </h1>
          <p class="mt-6 font-body text-lg leading-relaxed text-paper/70">
            Fini les petites cartes en papier qu'on perd. Vos clients gardent leur carte sur leur telephone, vous tamponnez en un clic.
          </p>
          <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row md:items-start">
            <NuxtLink
              to="/register"
              class="shimmer-btn rounded-full px-7 py-3.5 font-body text-base font-bold text-ink shadow-xl transition hover:scale-105"
            >
              Creer mon programme
            </NuxtLink>
            <a href="#essayer" class="font-body text-sm font-medium text-paper/70 underline-offset-4 hover:text-paper hover:underline">
              Essayer la carte &rarr;
            </a>
          </div>
          <div class="mt-10 flex items-center justify-center gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/40 md:justify-start">
            <span>Gratuit pour commencer</span>
            <span class="h-1 w-1 rounded-full bg-paper/30" />
            <span>Sans carte bancaire</span>
          </div>
        </div>

        <div class="relative w-full max-w-sm" v-reveal="120">
          <div
            class="pointer-events-none absolute -left-10 top-6 hidden select-none font-mono text-[10px] uppercase tracking-widest text-brass/70 md:block"
            style="--float-r: -10deg"
          >
            <div class="flex h-16 w-16 animate-float items-center justify-center rounded-full border-2 border-dashed border-brass/50 text-center leading-tight">
              Etabli<br />2026
            </div>
          </div>
          <div
            class="pointer-events-none absolute -right-6 bottom-10 hidden select-none md:block"
            style="--float-r: 8deg; animation-delay: -3s"
          >
            <div class="flex h-14 w-14 animate-float items-center justify-center rounded-full border-2 border-stamp/60 text-stamp">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M12 2l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" fill="currentColor"/></svg>
            </div>
          </div>

          <div v-tilt class="tilt-glow rounded-3xl">
            <StampCard
              program-name="Cafe des Artisans"
              :stamps-required="stampsRequired"
              :current-stamps="currentStamps"
              :rewards-available="currentStamps === 0 ? 1 : 0"
              reward-description="1 cafe offert"
            />
          </div>
        </div>
      </div>

      <a href="#comment-ca-marche" class="mx-auto mt-16 flex w-fit animate-bob items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 hover:text-paper/70">
        Decouvrir
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    </section>

    <!-- MARQUEE OF REWARDS -->
    <section class="border-b border-paper/10 py-8">
      <div class="marquee-row overflow-hidden">
        <div class="marquee-track">
          <span
            v-for="(reward, i) in [...rewardTicker, ...rewardTicker]"
            :key="i"
            class="flex shrink-0 items-center gap-2 rounded-full border border-paper/15 bg-paper/[0.04] px-5 py-2 font-mono text-xs uppercase tracking-wide text-paper/60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-brass"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ reward }}
          </span>
        </div>
      </div>
    </section>

    <!-- COMMENT CA MARCHE : timeline -->
    <section id="comment-ca-marche" class="mx-auto max-w-4xl px-6 py-24">
      <h2 class="mb-16 text-center font-display text-3xl italic text-paper md:text-4xl" v-reveal>Comment ca marche</h2>

      <div class="relative">
        <div class="visa-line absolute left-1/2 top-0 hidden h-full -translate-x-1/2 md:block" aria-hidden="true" />

        <div class="flex flex-col gap-14">
          <div
            v-for="(step, i) in timeline"
            :key="step.title"
            v-reveal="i * 100"
            class="relative flex flex-col items-center gap-6 md:flex-row"
            :class="i % 2 === 1 ? 'md:flex-row-reverse' : ''"
          >
            <div class="flex-1" :class="i % 2 === 1 ? 'md:text-left' : 'md:text-right'">
              <span class="font-mono text-xs uppercase tracking-[0.2em] text-brass">{{ step.tag }}</span>
              <h3 class="mt-2 font-display text-2xl italic text-paper">{{ step.title }}</h3>
              <p class="mt-2 font-body text-sm leading-relaxed text-paper/60">{{ step.text }}</p>
            </div>

            <div class="relative z-10 flex h-16 w-16 shrink-0 -rotate-6 items-center justify-center rounded-full border-2 border-brass bg-passport font-display text-2xl italic text-brass shadow-lg">
              {{ i + 1 }}
            </div>

            <div class="hidden flex-1 md:block" />
          </div>
        </div>
      </div>
    </section>

    <!-- DEMO INTERACTIVE -->
    <section id="essayer" class="grain relative border-y border-paper/10 py-24">
      <div class="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <span class="font-mono text-xs uppercase tracking-[0.2em] text-brass" v-reveal>A vous de jouer</span>
        <h2 class="mt-3 font-display text-3xl italic text-paper md:text-4xl" v-reveal="60">Cliquez pour tamponner la carte</h2>
        <p class="mt-4 max-w-md font-body text-sm text-paper/60" v-reveal="120">
          C'est exactement ce que vivent vos clients depuis leur telephone, et vous depuis votre espace commercant.
        </p>

        <div class="relative mt-10 w-full max-w-sm" v-reveal="180">
          <Transition name="burst-fade">
            <div v-if="justRewarded" :key="burstKey" class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <span
                v-for="(b, i) in burstBits"
                :key="i"
                class="absolute h-2 w-2 rounded-full bg-brass"
                :style="{ '--tx': b.tx, '--ty': b.ty, animation: `burst 0.9s ease-out ${b.delay} forwards` }"
              />
            </div>
          </Transition>

          <button
            type="button"
            class="block w-full cursor-pointer rounded-3xl text-left transition active:scale-[0.97]"
            aria-label="Tamponner la carte de demonstration"
            @click="simulateStamp"
          >
            <StampCard
              program-name="Cafe des Artisans"
              :stamps-required="stampsRequired"
              :current-stamps="currentStamps"
              :rewards-available="currentStamps === 0 ? 1 : 0"
              reward-description="1 cafe offert"
              class="shadow-2xl transition hover:shadow-brass/20"
            />
          </button>
        </div>

        <button
          type="button"
          class="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/40 underline-offset-4 hover:text-paper/70 hover:underline"
          @click="simulateStamp"
        >
          {{ currentStamps === stampsRequired ? 'Encaisser la recompense' : 'Ajouter un tampon' }} &rarr;
        </button>
      </div>
    </section>

    <!-- POUR QUI -->
    <section class="mx-auto max-w-5xl px-6 py-24">
      <h2 class="mb-4 text-center font-display text-3xl italic text-paper md:text-4xl" v-reveal>Pense pour tous les commerces de proximite</h2>
      <p class="mx-auto mb-14 max-w-lg text-center font-body text-sm text-paper/60" v-reveal="60">
        Partout ou la fidelite se construit visite apres visite.
      </p>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        <div
          v-for="(biz, i) in businessTypes"
          :key="biz.label"
          v-reveal="i * 60"
          class="group flex flex-col items-center gap-3 rounded-2xl border border-paper/10 bg-paper/[0.03] px-4 py-6 text-center transition hover:-translate-y-1 hover:border-brass/40 hover:bg-paper/[0.06]"
        >
          <span class="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-paper/25 text-brass transition group-hover:border-brass/60">
            <svg v-if="biz.icon === 'cup'" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 8h13v5a5 5 0 01-5 5H9a5 5 0 01-5-5V8z" stroke="currentColor" stroke-width="1.7"/><path d="M17 9h1.5a2.5 2.5 0 010 5H17" stroke="currentColor" stroke-width="1.7"/><path d="M7 3.5c-.5 1 .5 1.5 0 2.5M11 3.5c-.5 1 .5 1.5 0 2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            <svg v-else-if="biz.icon === 'scissors'" width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="6" r="2.4" stroke="currentColor" stroke-width="1.6"/><circle cx="6" cy="18" r="2.4" stroke="currentColor" stroke-width="1.6"/><path d="M8 7.5L20 19M8 16.5L20 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            <svg v-else-if="biz.icon === 'plate'" width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.4"/></svg>
            <svg v-else-if="biz.icon === 'sparkle'" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            <svg v-else-if="biz.icon === 'dumbbell'" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 9v6M2 10.5v3M20 9v6M22 10.5v3M6 12h12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 5.5A2.5 2.5 0 016.5 3H12v18H6.5A2.5 2.5 0 014 18.5v-13z" stroke="currentColor" stroke-width="1.6"/><path d="M20 5.5A2.5 2.5 0 0017.5 3H12v18h5.5a2.5 2.5 0 002.5-2.5v-13z" stroke="currentColor" stroke-width="1.6"/></svg>
          </span>
          <span class="font-mono text-[11px] uppercase tracking-wide text-paper/70">{{ biz.label }}</span>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="mx-auto max-w-4xl px-6 pb-28">
      <div class="grain relative overflow-hidden rounded-[2rem] border border-brass/30 bg-paper/[0.03] px-8 py-16 text-center" v-reveal>
        <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(201,162,39,0.18),transparent)]" />
        <h2 class="font-display text-3xl italic text-paper md:text-4xl">Vos clients reviennent plus souvent</h2>
        <p class="mx-auto mt-4 max-w-md font-body text-paper/60">
          Gratuit pour commencer. Aucune carte bancaire requise.
        </p>
        <NuxtLink
          to="/register"
          class="shimmer-btn mt-8 inline-block rounded-full px-8 py-4 font-body font-bold text-ink shadow-xl transition hover:scale-105"
        >
          Commencer maintenant
        </NuxtLink>
        <p class="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/40">2 minutes chrono &middot; sans engagement</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
@keyframes burst {
  0% { transform: translate(0, 0) scale(0.6); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
}
.burst-fade-enter-active { transition: opacity 0.2s ease; }
.burst-fade-leave-active { transition: opacity 0.6s ease; }
.burst-fade-enter-from,
.burst-fade-leave-to { opacity: 0; }
</style>
