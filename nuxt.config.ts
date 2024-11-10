// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';


export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: [
    'primeflex/primeflex.css',
    // other global styles if any
  ],
  modules: ['@primevue/nuxt-module', 'nuxt-gtag', '@nuxt/icon'],
  primevue: {
      options: {
          theme: {
              preset: Aura
          }
      }
  },
  gtag: {
    id: 'G-W3G93EXEL4'
  }
})