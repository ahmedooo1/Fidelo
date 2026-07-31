<script setup lang="ts">
const stampsRequired = 8
const currentStamps = ref(5)

function simulateStamp() {
  if (currentStamps.value < stampsRequired) {
    currentStamps.value++
  } else {
    currentStamps.value = 0
  }
}

const steps = [
  { title: 'Cree ton programme', text: 'Choisis le nombre de tampons et la recompense: "1 cafe offert au 8e", "-20% au 10e passage"...' },
  { title: 'Inscris tes clients', text: 'Chaque client recoit un code unique et une carte digitale accessible par lien, sans application a installer.' },
  { title: 'Tamponne a chaque visite', text: 'Depuis ton espace, cherche le code du client et ajoute un tampon en un clic. La recompense se declenche automatiquement.' },
]
</script>

<template>
  <main>
    <!-- HERO -->
    <section class="mx-auto flex max-w-6xl flex-col items-center gap-16 px-6 pb-24 pt-16 md:flex-row md:pt-24">
      <div class="max-w-xl text-center md:text-left">
        <span class="mb-5 inline-block rounded-full border border-paper/15 bg-paper/5 px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-paper/60">
          Fidelite digitale &middot; sans papier, sans app
        </span>
        <h1 class="font-display text-5xl italic leading-[1.05] text-paper md:text-6xl">
          La carte de fidelite <span class="text-brass">de votre commerce</span>, en digital
        </h1>
        <p class="mt-6 font-body text-lg leading-relaxed text-paper/70">
          Fini les petites cartes en papier qu'on perd. Vos clients gardent leur carte sur leur telephone, vous tamponnez en un clic.
        </p>
        <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row md:items-start">
          <NuxtLink
            to="/register"
            class="rounded-full bg-brass px-7 py-3.5 font-body text-base font-bold text-ink shadow-xl transition hover:scale-105"
          >
            Creer mon programme
          </NuxtLink>
          <button class="font-body text-sm font-medium text-paper/70 underline-offset-4 hover:text-paper hover:underline" @click="simulateStamp">
            Simuler un tampon &rarr;
          </button>
        </div>
      </div>

      <div class="w-full max-w-sm">
        <StampCard
          program-name="Cafe des Artisans"
          :stamps-required="stampsRequired"
          :current-stamps="currentStamps"
          :rewards-available="currentStamps === 0 ? 1 : 0"
          reward-description="1 cafe offert"
        />
      </div>
    </section>

    <!-- COMMENT CA MARCHE -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <h2 class="mb-12 font-display text-3xl italic text-paper md:text-4xl">Comment ca marche</h2>
      <div class="grid gap-10 md:grid-cols-3">
        <div v-for="(step, i) in steps" :key="step.title">
          <span class="font-mono text-xs uppercase tracking-[0.2em] text-brass">Etape {{ i + 1 }}</span>
          <h3 class="mt-2 font-display text-xl italic text-paper">{{ step.title }}</h3>
          <p class="mt-2 font-body text-sm leading-relaxed text-paper/60">{{ step.text }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="mx-auto max-w-4xl px-6 py-20 text-center">
      <h2 class="font-display text-3xl italic text-paper md:text-4xl">Vos clients reviennent plus souvent</h2>
      <p class="mx-auto mt-4 max-w-md font-body text-paper/60">
        Gratuit pour commencer. Aucune carte bancaire requise.
      </p>
      <NuxtLink
        to="/register"
        class="mt-8 inline-block rounded-full bg-brass px-8 py-4 font-body font-bold text-ink shadow-xl transition hover:scale-105"
      >
        Commencer maintenant
      </NuxtLink>
    </section>
  </main>
</template>
