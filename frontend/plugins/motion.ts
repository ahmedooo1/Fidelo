import type { DirectiveBinding } from 'vue'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// v-reveal: fades/rises an element into place the first time it enters the viewport.
// Optional arg controls the stagger delay in ms, e.g. v-reveal="120"
const revealObserver = new WeakMap<Element, IntersectionObserver>()

function mountReveal(el: HTMLElement, binding: DirectiveBinding<number | undefined>) {
  if (prefersReducedMotion()) {
    el.classList.add('is-visible')
    return
  }
  el.classList.add('reveal')
  const delay = typeof binding.value === 'number' ? binding.value : 0
  if (delay) el.style.transitionDelay = `${delay}ms`

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.unobserve(el)
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  )
  io.observe(el)
  revealObserver.set(el, io)
}

// v-tilt: subtle pointer-following 3D tilt, disabled on touch / reduced motion.
function mountTilt(el: HTMLElement) {
  if (prefersReducedMotion() || matchMedia('(pointer: coarse)').matches) return
  el.classList.add('tilt')
  let frame = 0

  const onMove = (e: PointerEvent) => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      el.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(px * 12).toFixed(2)}deg`)
      el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`)
      el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`)
      frame = 0
    })
  }
  const onLeave = () => {
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)
}

export default defineNuxtPlugin((nuxtApp) => {
  // getSSRProps is required so Vue's server renderer knows how to handle
  // these directives during SSR; the real behaviour only runs client-side.
  nuxtApp.vueApp.directive('reveal', {
    mounted: mountReveal,
    getSSRProps: () => ({}),
  })
  nuxtApp.vueApp.directive('tilt', {
    mounted: mountTilt,
    getSSRProps: () => ({}),
  })
})
