export default defineNuxtConfig({
  compatibilityDate: '2024-08-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Fidelo - La carte de fidélité de votre commerce, en digital',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Fidelo transforme la carte de fidélité papier en carte digitale : tampons, récompenses et suivi client sans rien imprimer.',
        },
        { name: 'theme-color', content: '#0A2B2C' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Fidelo' },
        { property: 'og:title', content: 'Fidelo - La carte de fidélité de votre commerce, en digital' },
        {
          property: 'og:description',
          content:
            'Fidelo transforme la carte de fidélité papier en carte digitale : tampons, récompenses et suivi client sans rien imprimer.',
        },
        { property: 'og:image', content: 'https://fidelo.aaweb.fr/og-image.png' },
        { property: 'og:url', content: 'https://fidelo.aaweb.fr' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Fidelo - La carte de fidélité de votre commerce, en digital' },
        { name: 'twitter:image', content: 'https://fidelo.aaweb.fr/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/icon.png' },
        { rel: 'apple-touch-icon', href: '/icon.png' },
      ],
      script: [{ src: 'https://accounts.google.com/gsi/client', async: true, defer: true }],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3021/api',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    },
  },
})
