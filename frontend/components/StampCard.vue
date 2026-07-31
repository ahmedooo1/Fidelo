<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    stampsRequired: number
    currentStamps: number
    rewardsAvailable?: number
    rewardDescription?: string
    programName?: string
  }>(),
  {
    rewardsAvailable: 0,
    rewardDescription: '',
    programName: '',
  },
)

const slots = computed(() =>
  Array.from({ length: props.stampsRequired }, (_, i) => i < props.currentStamps),
)
</script>

<template>
  <div class="card-frame relative overflow-hidden rounded-3xl bg-paper text-ink shadow-2xl">
    <div class="perforation absolute left-0 top-0 h-full w-3" />

    <div class="px-8 py-7 pl-10">
      <p class="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">Carte de fidelite</p>
      <h3 v-if="programName" class="mt-1 font-display text-3xl italic text-passport">{{ programName }}</h3>

      <div class="mt-6 flex flex-wrap gap-3">
        <div
          v-for="(filled, i) in slots"
          :key="i"
          class="relative flex h-11 w-11 items-center justify-center rounded-full border-2"
          :class="filled ? 'border-stamp animate-stampIn' : 'border-dashed border-ink/25'"
        >
          <svg v-if="filled" viewBox="0 0 40 40" class="absolute inset-0 h-full w-full -rotate-6 text-stamp opacity-90">
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="2.5" />
            <path d="M12 21l5 5 11-12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span v-else class="font-mono text-xs text-ink/30">{{ i + 1 }}</span>
        </div>
      </div>

      <div
        v-if="rewardsAvailable > 0"
        class="mt-6 flex items-center gap-3 rounded-2xl border border-brass/40 bg-brass/10 px-4 py-3"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" class="shrink-0 text-brass">
          <path d="M12 2l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" fill="currentColor" />
        </svg>
        <p class="font-body text-sm font-medium text-passport">
          {{ rewardsAvailable }} recompense{{ rewardsAvailable > 1 ? 's' : '' }} prete{{ rewardsAvailable > 1 ? 's' : '' }}
          <span v-if="rewardDescription" class="block text-xs font-normal text-ink/60">{{ rewardDescription }}</span>
        </p>
      </div>
      <p v-else class="mt-5 font-body text-xs text-ink/50">
        Encore {{ stampsRequired - currentStamps }} tampon{{ stampsRequired - currentStamps > 1 ? 's' : '' }} avant
        {{ rewardDescription ? `: ${rewardDescription}` : 'ta recompense' }}
      </p>
    </div>
  </div>
</template>
