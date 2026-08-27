<script setup lang="ts">
useHead({ title: 'Mentions légales — Fidelo' })
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 py-14">
    <h1 class="font-display text-3xl italic text-paper">Mentions légales</h1>

    <nav class="mt-3 flex gap-4 text-sm text-paper/60">
      <NuxtLink to="/legal/mentions-legales" class="text-brass underline">Mentions légales</NuxtLink>
      <NuxtLink to="/legal/cgu" class="hover:text-paper">CGU / CGV</NuxtLink>
      <NuxtLink to="/legal/confidentialite" class="hover:text-paper">Confidentialité</NuxtLink>
    </nav>

    <p class="mt-6 rounded-xl border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-paper">
      ⚠ Certains champs ci-dessous restent à compléter avec les informations réelles de l'éditeur
      (raison sociale, SIRET, adresse) avant une mise en exploitation commerciale.
    </p>

    <div class="mt-8 space-y-8 text-sm leading-relaxed text-paper/80">
      <section>
        <h2 class="font-display text-lg text-paper">Éditeur du site</h2>
        <p class="mt-2">
          Le site fidelo.aaweb.fr est édité par <strong>[NOM / RAISON SOCIALE À COMPLÉTER]</strong>,
          [forme juridique à préciser : entreprise individuelle / micro-entreprise / société],
          [le cas échéant, immatriculée sous le numéro SIRET <strong>[SIRET]</strong>], dont le siège
          ou l'adresse de correspondance est <strong>[ADRESSE À COMPLÉTER]</strong>.
        </p>
        <p class="mt-2">
          Directeur de la publication : <strong>[PRÉNOM NOM]</strong> — Contact :
          <strong>aahmadooo997@gmail.com</strong>.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg text-paper">Hébergement</h2>
        <p class="mt-2">
          Le site est hébergé par <strong>OVH SAS</strong>, société par actions simplifiée au
          capital de 10 174 560 €, RCS Lille Métropole 424 761 419, dont le siège social est situé
          2 rue Kellermann, 59100 Roubaix, France.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg text-paper">Propriété intellectuelle</h2>
        <p class="mt-2">
          L'ensemble des contenus du site (textes, logo, interface) est la propriété exclusive de
          l'éditeur, sauf mention contraire. Toute reproduction sans autorisation est interdite.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg text-paper">Données personnelles</h2>
        <p class="mt-2">
          Les traitements de données personnelles sont décrits dans notre
          <NuxtLink to="/legal/confidentialite" class="text-brass underline">politique de confidentialité</NuxtLink>.
        </p>
      </section>
    </div>
  </main>
</template>
