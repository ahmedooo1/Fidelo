<script setup lang="ts">
const timeline = [
  {
    title: 'Crée ton programme',
    text: 'Choisis le nombre de tampons et la récompense : "1 café offert au 8e", "-20% au 10e passage"... Prêt en 2 minutes.',
  },
  {
    title: 'Inscris tes clients',
    text: 'Chaque client reçoit un code unique et une carte digitale accessible par lien direct, sans application à installer.',
  },
  {
    title: 'Tamponne à chaque visite',
    text: 'Depuis ton espace, cherche le code du client et ajoute un tampon en un clic. La récompense se déclenche automatiquement.',
  },
]

const businessTypes = [
  { label: 'Café', icon: 'cup' },
  { label: 'Coiffeur', icon: 'scissors' },
  { label: 'Restaurant', icon: 'plate' },
  { label: 'Institut beauté', icon: 'sparkle' },
  { label: 'Salle de sport', icon: 'dumbbell' },
  { label: 'Librairie', icon: 'book' },
]
</script>

<template>
  <main class="overflow-x-clip">
    <!-- HERO -->
    <section class="grain relative border-b border-paper/10 pb-20 pt-16 md:pb-24 md:pt-24">
      <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(201,162,39,0.14),transparent)]" />

      <div class="relative z-10 mx-auto flex max-w-6xl min-w-0 flex-col items-center gap-16 px-6 md:flex-row">
        <div class="min-w-0 max-w-xl text-center md:text-left" v-reveal>
          <h1 class="font-display text-5xl italic leading-[1.05] text-paper md:text-6xl">
            La carte de fidélité <span class="text-brass underline decoration-solid decoration-4 underline-offset-8 decoration-brass/60">de votre commerce</span>, en digital
          </h1>
          <p class="mt-6 font-body text-lg leading-relaxed text-paper/70">
            Fini les petites cartes en papier qu'on perd. Vos clients gardent leur carte sur leur téléphone, vous tamponnez en un clic.
          </p>
          <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row md:items-start">
            <NuxtLink
              to="/register"
              class="shimmer-btn rounded-full px-7 py-3.5 font-body text-base font-bold text-ink shadow-xl transition hover:scale-105"
            >
              Créer mon programme
            </NuxtLink>
          </div>
          <p class="mt-6 font-body text-sm text-paper/50">Gratuit pour commencer, sans carte bancaire.</p>
        </div>

        <div class="w-full max-w-[350px] shrink-0" v-reveal="120">
          <HeroMotion />
        </div>
      </div>
    </section>

    <!-- COMMENT CA MARCHE : timeline -->
    <section id="comment-ca-marche" class="mx-auto max-w-4xl px-6 py-24">
      <h2 class="mb-16 text-center font-display text-3xl italic text-paper md:text-4xl" v-reveal>Comment ça marche</h2>

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
              <h3 class="font-display text-2xl italic text-paper">{{ step.title }}</h3>
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

    <!-- POUR QUI -->
    <section class="mx-auto max-w-5xl px-6 py-24">
      <h2 class="mb-4 text-center font-display text-3xl italic text-paper md:text-4xl" v-reveal>Pensé pour tous les commerces de proximité</h2>
      <p class="mx-auto mb-14 max-w-lg text-center font-body text-sm text-paper/60" v-reveal="60">
        Partout où la fidélité se construit visite après visite.
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
          <span class="font-body text-sm text-paper/80">{{ biz.label }}</span>
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
      </div>
    </section>
  </main>
</template>
