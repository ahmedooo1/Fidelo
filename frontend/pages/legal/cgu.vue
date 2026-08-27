<script setup lang="ts">
useHead({ title: 'CGU / CGV — Fidelo' })
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 py-14">
    <h1 class="font-display text-3xl italic text-paper">Conditions générales d'utilisation et de vente</h1>

    <nav class="mt-3 flex gap-4 text-sm text-paper/60">
      <NuxtLink to="/legal/mentions-legales" class="hover:text-paper">Mentions légales</NuxtLink>
      <NuxtLink to="/legal/cgu" class="text-brass underline">CGU / CGV</NuxtLink>
      <NuxtLink to="/legal/confidentialite" class="hover:text-paper">Confidentialité</NuxtLink>
    </nav>

    <p class="mt-6 rounded-xl border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-paper">
      ⚠ Modèle à faire relire par un professionnel avant mise en exploitation commerciale.
    </p>

    <div class="mt-8 space-y-8 text-sm leading-relaxed text-paper/80">
      <section>
        <h2 class="font-display text-lg text-paper">1. Objet</h2>
        <p class="mt-2">
          Fidelo est une plateforme de cartes de fidélité numériques destinée aux commerçants
          (« le Commerçant »), leur permettant de créer un programme de fidélité et de gérer les
          cartes de leurs propres clients (« le Membre »). Les présentes conditions régissent
          l'accès et l'utilisation du service par le Commerçant.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg text-paper">2. Accès au service et tarifs</h2>
        <p class="mt-2">
          Le service est actuellement proposé gratuitement, sans engagement. L'éditeur se réserve
          la possibilité de faire évoluer les fonctionnalités et modalités d'accès du service ; les
          Commerçants en seront informés à l'avance en cas d'introduction d'une offre payante.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg text-paper">3. Compte Commerçant</h2>
        <p class="mt-2">
          L'accès nécessite la création d'un compte (email et mot de passe). Le Commerçant est seul
          responsable de la confidentialité de ses identifiants et de l'ensemble des actions
          effectuées depuis son compte, ainsi que de la définition des règles de son programme de
          fidélité (nombre de tampons requis, récompense associée).
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg text-paper">4. Cartes de fidélité et Membres</h2>
        <p class="mt-2">
          Chaque carte de fidélité est identifiée par un code unique consultable par le Membre, sans
          création de compte. Le Commerçant est responsable de l'exactitude des informations
          saisies concernant ses Membres (nom, contact) et de l'obtention, le cas échéant, de leur
          consentement à être contactés.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg text-paper">5. Disponibilité du service</h2>
        <p class="mt-2">
          L'éditeur s'efforce d'assurer une disponibilité continue du service mais ne garantit pas
          l'absence d'interruptions, notamment pour maintenance. La responsabilité de l'éditeur ne
          saurait être engagée en cas d'indisponibilité temporaire ou de perte de données résultant
          d'un cas de force majeure.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg text-paper">6. Résiliation</h2>
        <p class="mt-2">
          Le Commerçant peut supprimer son compte à tout moment. L'éditeur peut suspendre ou
          supprimer un compte en cas d'usage non conforme aux présentes conditions ou à la loi.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg text-paper">7. Droit applicable</h2>
        <p class="mt-2">
          Les présentes conditions sont soumises au droit français. Tout litige relève des
          tribunaux compétents de <strong>[VILLE À COMPLÉTER]</strong>, sous réserve des règles
          protectrices applicables aux consommateurs.
        </p>
      </section>
    </div>
  </main>
</template>
