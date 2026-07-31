<script setup lang="ts">
const auth = useAuthStore()
const mobileOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-paper/10 bg-passport/90 backdrop-blur-xl">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <NuxtLink to="/" class="font-display text-2xl italic text-paper">
        fidelo<span class="text-brass">.</span>
      </NuxtLink>

      <div class="hidden items-center gap-3 md:flex">
        <template v-if="auth.user">
          <NuxtLink to="/dashboard" class="text-sm text-paper/80 transition hover:text-paper">
            {{ auth.user.businessName }}
          </NuxtLink>
          <NuxtLink
            to="/programs/new"
            class="rounded-full bg-brass px-5 py-2 text-sm font-semibold text-ink transition hover:scale-105"
          >
            Nouveau programme
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="text-sm text-paper/80 transition hover:text-paper">Connexion</NuxtLink>
          <NuxtLink
            to="/register"
            class="rounded-full bg-brass px-5 py-2 text-sm font-semibold text-ink transition hover:scale-105"
          >
            Essayer gratuitement
          </NuxtLink>
        </template>
      </div>

      <button class="text-paper md:hidden" aria-label="Ouvrir le menu" @click="mobileOpen = !mobileOpen">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div v-if="mobileOpen" class="border-t border-paper/10 px-6 py-4 md:hidden">
      <div class="flex flex-col gap-4 text-paper/80">
        <NuxtLink v-if="auth.user" to="/dashboard" @click="mobileOpen = false">Mon espace</NuxtLink>
        <NuxtLink v-else to="/login" @click="mobileOpen = false">Connexion</NuxtLink>
        <NuxtLink
          to="/register"
          class="w-fit rounded-full bg-brass px-5 py-2 text-sm font-semibold text-ink"
          @click="mobileOpen = false"
        >
          Essayer gratuitement
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
